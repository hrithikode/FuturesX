import { prisma } from "@repo/prisma";
import { redis } from "@repo/redis";

const CALLBACK_QUEUE = "callback-queue";

type CloseOrderPayload = {
  orderId: string;
  userId: string;
};

export async function closeOrder( payload: CloseOrderPayload) {
  try {
    const { orderId, userId } = payload;

    const existingOrder = await prisma.order.findUnique({
        where: {
          id: orderId
        }
    });

    if ( !existingOrder || existingOrder.status !== "open") {
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

    const livePrice = await redis.get(
      `price:${existingOrder.symbol}`
    );

    if (!livePrice) {
      await redis.xadd(
        CALLBACK_QUEUE,
        "*",
        "id",
        orderId,
        "status",
        "no_price"
      );
      return;
    }

    const parsedPrice = JSON.parse(livePrice);

    const closingPrice =
      existingOrder.side === "long"
        ? parsedPrice.bid
        : parsedPrice.ask;

    const qty = existingOrder.qty / Math.pow(10, existingOrder.qtyDecimals);

    const openingPrice = existingOrder.openingPrice / Math.pow(10, existingOrder.priceDecimals);
    
    console.log("opening peice", openingPrice)
    
    const margin = existingOrder.margin / 100;

    let pnl = 0;

    if (existingOrder.side === "long") {
      pnl = (closingPrice - openingPrice) * qty;
    } else {
      pnl = (openingPrice - closingPrice) * qty;
    }
    pnl = Number(pnl.toFixed(2));
    console.log("closing Price", closingPrice)

    const finalSettlement = Number((margin + pnl).toFixed(2));
    console.log("pnl" , pnl);
    console.log("final settlement", finalSettlement)

    console.log("Before closing order update:", orderId);
    await prisma.$transaction( async (tx) => {
        await tx.order.update({
          where: {
            id: orderId
          },
          data: {
            status: "closed",
            closedAt: new Date(),
            pnl: Math.floor(pnl * 100 ),
            finalSettlement: Math.floor(finalSettlement * 100)
          }
        });

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
                Math.floor(finalSettlement * 100)
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
    console.error( "Close order engine error:", error);

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