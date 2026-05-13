import { prisma } from "@repo/prisma";
import { redis } from "@repo/redis";

const CALLBACK_QUEUE = "callback-queue";

type CreateOrderPayload = {
  orderId: string;
  userId: string;
  symbol: "BTCUSDT" | "ETHUSDT" | "SOLUSDT";
  side: "long" | "short";
  qty: number;
  leverage: number;
  balanceSnapshot: {
    id: number;
    symbol: string;
    balance: number;
    decimals: number;
  }| null;
  enqueuedAt: number;
};

export async function createOrder( payload: CreateOrderPayload) {
  try {
    console.log( "Processing create-order:", payload.orderId );

    const {
      orderId,
      userId,
      symbol,
      side,
      qty,
      leverage,
      balanceSnapshot,
    } = payload;

    const price = await redis.get(
      `price:${symbol}`
    );

  if (!price) {
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

  const openingPrice = Number(price);

  const requiredMargin = (openingPrice * qty) / leverage;

    const usdtAsset = balanceSnapshot;

    if (!usdtAsset) {
      await redis.xadd(
        CALLBACK_QUEUE,
        "*",
        "id",
        orderId,
        "status",
        "wallet_not_found"
      );
      return;
    }

    const realBalance = usdtAsset.balance / Math.pow( 10, usdtAsset.decimals);

    if ( realBalance < requiredMargin ) {
      await redis.xadd(
        CALLBACK_QUEUE,
        "*",
        "id",
        orderId,
        "status",
        "insufficient_balance"
      );

      return;
    }

   console.log("BEFORE TRANSACTION:", orderId );
    await prisma.$transaction(async (tx) => {
        await tx.order.create({
          data: {
            id: orderId,
            userId,
            symbol,
            side,
            qty: Math.floor(qty * 100000000),
            qtyDecimals: 8,
            leverage,
            openingPrice: openingPrice * 10000, priceDecimals: 4,
            margin: Math.floor(requiredMargin * 100),
            status: "open",
          },
        });
        
        await tx.asset.update({
          where: {
            id: usdtAsset.id,
          },
          data: {
            balance: {
              decrement:
                Math.floor(requiredMargin * Math.pow( 10, usdtAsset.decimals)),
            },
          },
        });
      }
    );
  console.log("ASSET UPDATED:", orderId);

  console.log("SENDING CREATED CALLBACK:",orderId);
    await redis.xadd(
      CALLBACK_QUEUE,
      "*",
      "id",
      orderId,
      "status",
      "created"
    );

    console.log("Order created:", orderId);
  } catch (error) {
    console.error("Create order engine error:", error);

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