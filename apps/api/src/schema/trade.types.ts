import z from "zod";

export const CreateOrderBodySchema = z.object({
    symbol: z.enum(["BTCUSDT", "ETHUSDT", "SOLUSDT"]),
    side: z.enum(["long", "short"]),
    qty: z.coerce.number(),
    leverage: z.coerce.number(),
});


export const CloseOrderBodySchema = z.object({
    orderId: z.string().uuid()
});

