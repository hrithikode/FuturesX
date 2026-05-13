import { WebSocketServer } from "ws";
import { redis } from "@repo/redis";

const wss = new WebSocketServer({port: 8080});

console.log("WebSocket server started");

wss.on("connection", (ws) => {
    console.log( "Client connected");

    const interval = setInterval( async () => {
          const price = await redis.get(
              "price:BTCUSDT"
            );

          ws.send( JSON.stringify({
              symbol: "BTCUSDT",
              price
            })
            );
        }, 2000
    );

    ws.on( "close", () => {
        clearInterval(interval);

        console.log( "Client disconnected");
    }
    );
}
);