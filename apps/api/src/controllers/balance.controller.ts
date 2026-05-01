import { prisma } from "@repo/prisma";
import { Request, Response } from "express";
import { getBalanceByAssetSchema } from "../schema/balance.schema.js";

export const getBalance = async (req: Request, res: Response) => {
    const userId = req.user.id;

    if(!userId) {
        return res.status(404).json("user mot found");
    }

    const balances = await prisma.asset.findMany({
        where: {
            userId: userId
        },
        select: {
            symbol: true,
            balance: true,
            decimals: true
        }
    });
    res.json({ userId, balances })
}

export const getBalanceByAsset = async (req: Request, res: Response ) => {
    const userId = req.user.id;

    if(!userId) {
        return res.json("user not found");
    }

    const result = getBalanceByAssetSchema.safeParse(req.params);


export const depositBalance = async (req: Request , res: Response ) => {
    const user = await 
}