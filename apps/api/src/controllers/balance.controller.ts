import { prisma } from "@repo/prisma";
import { Request, Response } from "express";

export const getBalance = async (req: Request, res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    const balance =
      await prisma.asset.findUnique({
        where: {
          user_symbol_unique: {
            userId,
            symbol: "USDT"
          }
        },
        select: {
          symbol: true,
          balance: true,
          decimals: true
        }
      });

    if (!balance) {
      return res.status(404).json({
        error: "Balance not found"
      });
    }

    return res.json({
      symbol: balance.symbol,
      availableBalance: balance.balance / Math.pow(10, balance.decimals)
    });
    
  } catch (error) {
    console.error(
      "Get balance error:",
      error
    );

    return res.status(500).json({
      error:
        "Internal server error"
    });
  }
};