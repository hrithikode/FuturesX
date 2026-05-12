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

export async function createOrder(
  payload: CreateOrderPayload
) {
  try {
    console.log(
      "Processing create-order:",
      payload.orderId
    );

    const {
      orderId,
      userId,
      symbol,
      side,
      qty,
      leverage,
      balanceSnapshot,
    } = payload;

    /*
      STEP 1
      Hardcoded live market price for MVP

      Later:
      Redis live price feed
    */
    const openingPrice = 60000;

    /*
      STEP 2
      Required Margin

      Formula:
      (price × qty) / leverage
    */
    const requiredMargin =
      (openingPrice * qty) / leverage;

    /*
      STEP 3
      Get USDT wallet
    */
    const usdtAsset =
      balanceSnapshot;

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

    /*
      STEP 4
      Balance validation

      Asset balance stored in scaled int

      Example:
      balance = 500000
      decimals = 2

      real balance = 5000
    */
    const realBalance =
      usdtAsset.balance /
      Math.pow(
        10,
        usdtAsset.decimals
      );

    if (
      realBalance < requiredMargin
    ) {
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

    /*
      STEP 5
      Transaction callback style

      Better for real engines
    */
   console.log(
  "BEFORE TRANSACTION:",
  orderId
);
    await prisma.$transaction(
      async (tx) => {
        /*
          Create Order
        */
        await tx.order.create({
          data: {
            id: orderId,
            userId,

            symbol,
            side,

            qty: Math.floor(
              qty * 100000000
            ),
            qtyDecimals: 8,

            leverage,

            openingPrice:
              openingPrice * 10000,
            priceDecimals: 4,

            margin: Math.floor(
              requiredMargin * 100
            ),

            status: "open",
          },
        });
        
        /*
          Deduct margin
        */
        await tx.asset.update({
          where: {
            id: usdtAsset.id,
          },
          data: {
            balance: {
              decrement:
                Math.floor(
                  requiredMargin *
                    Math.pow(
                      10,
                      usdtAsset.decimals
                    )
                ),
            },
          },
        });
      }
    );
console.log(
  "ASSET UPDATED:",
  orderId
);
    /*
      STEP 6
      Success callback
    */console.log(
  "SENDING CREATED CALLBACK:",
  orderId
);
    await redis.xadd(
      CALLBACK_QUEUE,
      "*",
      "id",
      orderId,
      "status",
      "created"
    );

    console.log(
      "Order created:",
      orderId
    );
  } catch (error) {
    console.error(
      "Create order engine error:",
      error
    );

    /*
      Failure callback
    */
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