import { prisma } from "@repo/prisma";
import { redis } from "@repo/redis";

const CALLBACK_QUEUE =
  "callback-queue";

type CloseOrderPayload = {
  orderId: string;
  userId: string;
};

export async function closeOrder(
  payload: CloseOrderPayload
) {
  try {
    const {
      orderId,
      userId
    } = payload;

    const existingOrder =
      await prisma.order.findUnique({
        where: {
          id: orderId
        }
      });

    if (
      !existingOrder ||
      existingOrder.status !== "open"
    ) {
      await redis.xadd(
        CALLBACK_QUEUE,
        "*",
        "id",
        orderId,
        "status",
        "invalid_order"
      );
      return;
    }

    /*
      Hardcoded live market price
      later from Redis
    */
    const closingPrice = 65000;

    /*
      Convert stored values
    */
    const qty =
      existingOrder.qty /
      Math.pow(
        10,
        existingOrder.qtyDecimals
      );

    const openingPrice =
      existingOrder.openingPrice /
      Math.pow(
        10,
        existingOrder.priceDecimals
      );

    const margin =
      existingOrder.margin / 100;

    /*
      PnL calculation
    */
    let pnl = 0;

    if (
      existingOrder.side === "long"
    ) {
      pnl =
        (closingPrice -
          openingPrice) * qty;
    } else {
      pnl =
        (openingPrice -
          closingPrice) * qty;
    }

    const finalSettlement =
      margin + pnl;

    await prisma.$transaction(
      async (tx) => {
        /*
          Close order
        */
        await tx.order.update({
          where: {
            id: orderId
          },
          data: {
            status: "closed",
            closedAt: new Date()
          }
        });

        /*
          Return funds
        */
        await tx.asset.update({
          where: {
            user_symbol_unique: {
              userId,
              symbol: "USDT"
            }
          },
          data: {
            balance: {
              increment:
                Math.floor(
                  finalSettlement * 100
                )
            }
          }
        });
      }
    );

    await redis.xadd(
      CALLBACK_QUEUE,
      "*",
      "id",
      orderId,
      "status",
      "closed"
    );
  } catch (error) {
    console.error(
      "Close order engine error:",
      error
    );

    await redis.xadd(
      CALLBACK_QUEUE,
      "*",
      "id",
      payload.orderId,
      "status",
      "failed"
    );
  }
}