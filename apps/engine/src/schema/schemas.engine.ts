import { symbol, z } from "zod";

export const CreateOrderSchema = z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    asset:z.string().min(1),
    side: z.enum(["long", "short"]),
    qty: z.number().positive(),
    leverage: z.number().positive().default(1),
    takeProfit: z.number().positive().optional(),
    stopLoss: z.number().positive().optional(),
    balanceSnapshot: z.array(
        z.object({
            symbol: z.string(),
            balance: z.number(),
            decimals: z.number()
        })
    ).optional()
});