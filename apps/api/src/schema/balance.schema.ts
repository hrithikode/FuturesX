import z from 'zod';

export const SymbolSchema = z.enum(["USDT", 'BTC']);

export const getBalanceByAssetSchema = z.object({
    symbol: SymbolSchema,
})

export const DepositBalanceBodySchema = z.object({
    symbol: SymbolSchema,
    amount: z.coerce.number().positive(),
    decimals: z.coerce.number().int().min(0).max(8).default(2)
})