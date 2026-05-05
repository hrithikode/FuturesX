import dotenv from "dotenv"
dotenv.config();


import { redis } from "@repo/redis"
const client = redis.duplicate();

const ENGINE_STREAM = "engine-stream";

async function runEngine () {
    //check redis stream
    console.log("engine started");
    while(true) {
        const checkStream = await client.xread(
            "BLOCK",
            0,
            "STREAMS",
            ENGINE_STREAM,
            "$"
        );
        console.log(JSON.stringify(checkStream, null, 2));

        if (!checkStream) {
            continue
        }

        const [, message] = checkStream[0]!;
        
        if(!message) {
            continue
        }

        for(const [streamId, rawFields] of message) {
            console.log(streamId);
            console.log(rawFields);

            const raw = rawFields[1];

            if (!raw) {
                continue;
            }
            const parsedMessage = JSON.parse((raw))
            console.log("this is the parse message: ",  JSON.stringify(parsedMessage, null, 2))

            if(parsedMessage.kind === "create-order") {
                console.log("create order received")
                console.log(parsedMessage.payload);

                const {
                    orderId,
                    userId,
                    asset,
                    side,
                    qty,
                    leverage,
                    takeProfit,
                    stopLoss,
                    balanceSnapshot
                } = parsedMessage.payload;
                console.log("Sending callback for ID:", orderId);
                
                const currentPrice = 50000;
                   
                const requiredMargin = (qty * currentPrice) /leverage; 
                console.log(requiredMargin);
                
                if(balanceSnapshot < requiredMargin) {
                    await redis.xadd(
                        "callback-queue",
                        "*",
                        "id",
                        orderId,
                        "status",
                        "insufficient_balance"
                    );
                    console.log("insufficient balance callback");
                    continue;
                }

                await redis.xadd(
                    "callback-queue",
                    "*",
                    "id",
                    orderId,
                    "status",
                    "created"
                );
                console.log("success callback sent");
                
            }
        }

    }
    
}
runEngine();