import { randomUUID } from "crypto";
import { CloseOrderBodySchema, CreateOrderBodySchema } from "../schema/trade.types.js";
import { Request, Response, } from "express";
import { prisma } from "@repo/prisma";
import { redis } from "@repo/redis";
import { subscriber } from "../subscriber.js";

async function getBalance(userId: string) {
    const userBalance = await prisma.asset.findUnique({
        where: {
            user_symbol_unique: {
                userId,
                symbol: "USDT"
            }
          },
            select: {
                id: true,
                symbol: true,
                balance: true,
                decimals:true
            },
      });
    return userBalance;
}

const addtoStream = async ( request:any) => {
    await redis.xadd(
        "engine-stream",
        "*",
        "data",
        JSON.stringify(request)
    );
}


async function sendRequestAndWait(orderId: string, request:any ) {
    try{
        const waitPromise =
        subscriber.waitForMessage(orderId);

        await addtoStream(request);

        return await waitPromise;

    } catch(error) {
        throw error;
    }
}

export const createOrder = async (req: Request, res: Response ) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        const result = CreateOrderBodySchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: result.error.message
            });
        }

        const {
            symbol,
            side,
            qty,
            leverage
        } = result.data;
    
        const orderId = randomUUID();

        const balanceSnapshot = await getBalance(userId);

        const payload = {
            action: "create-order",
            payload: {
                orderId,
                userId,
                symbol,
                side,
                qty: Number(qty),
                leverage: Number(leverage),
                balanceSnapshot,
                enqueuedAt: Date.now(),
            }
            };
            console.log("Waiting for callback ID:", orderId);

            const callback = await sendRequestAndWait(orderId, payload);
            
            if (callback.status === "insufficient_balance") {
                return res.status(400).json({ 
                    error: "Insufficient balance",
                    message: "You don't have enough balance to place this order"
                });
            }
    
            if (callback.status === "no_price") {
            return res.status(400).json({ 
                error: "Price not available",
                message: "Market price is not available for this asset"
            });
            }
            
            if (callback.status === "invalid_order") {
            return res.status(400).json({ 
                error: "Invalid order",
                message: "Order parameters are invalid"
            });
            }
            
            if (callback.status !== "created") {
            return res.status(400).json({ 
                error: "Order creation failed",
                message: `Order was not created. Status: ${callback.status}`
            });
            }
            console.log("reached here");
            return res.json({ message: "order created", orderId: orderId})
            
                    
            } catch (error) {
                console.error("Create order error:", error);
                return res.status(500).json({
                    error: "Internal server error"
                });
            }
}


export const closeOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "User not found"
      });
    }
    const result = CloseOrderBodySchema.safeParse({orderId: req.params.orderId});

    if(!result.success) {
        return res.status(400).json({
            error: result.error.message
        })
    }

    const { orderId } = result.data;

    if (!orderId) {
      return res.status(400).json({
        error: "Order ID is required"
      });
    }

    const existingOrder =
      await prisma.order.findUnique({
        where: {
          id: orderId
        }
      });

    if (!existingOrder) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    if (existingOrder.userId !== userId) {
      return res.status(403).json({
        error: "Unauthorized"
      });
    }

    if (existingOrder.status !== "open") {
      return res.status(400).json({
        error: "Order already closed"
      });
    }

    const payload = {
      action: "close-order",
      payload: {
        orderId,
        userId,
        symbol: existingOrder.symbol,
        side: existingOrder.side
      }
    };

    const callback = await sendRequestAndWait(orderId, payload);

    if ( callback.status !== "closed") {
      return res.status(400).json({
        error: "Close order failed"
      });
    }

    return res.json({
      message:
        "Order closed successfully",
          pnl: callback.pnl,
          settlement: callback.settlement
    });
  } catch (error) {
    console.error("Close order error:", error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

export const getOrders = async (req: Request , res:Response ) => {
    try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    const orders =
      await prisma.order.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: "desc"
        },
        select: {
            id: true,
            symbol: true,
            side: true,
            leverage: true,
            qty: true,
            pnl: true,
            status: true,
            qtyDecimals: true,
            openingPrice: true,
            priceDecimals: true,
            margin: true,
            createdAt: true
        }
      });

    const openOrders = orders.filter((order) => order.status === "open");

    const closedOrders = orders.filter((order) => order.status === "closed");

    return res.json({
      openOrders,
      closedOrders
    });

  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
