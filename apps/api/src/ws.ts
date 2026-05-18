import { WebSocket, WebSocketServer } from "ws";
import { redis } from "@repo/redis";

export async function startWebSocketServer(
  server: any
) {
  const wss = new WebSocketServer({server});

  const subscriber = redis.duplicate();

  wss.on("connection", async (socket) => {
    console.log("Frontend connected");

    const latestPrice = await redis.get(
        "price:BTCUSDT"
      );

    if (latestPrice) {
      socket.send(latestPrice);
    }

    socket.on("close", () => {
      console.log(
        "Frontend disconnected"
      );
    });
  });

  await subscriber.subscribe(
    "channel:market:btcusdt"
  );

  subscriber.on(
    "message",
    (channel, message) => {
      if (
        channel ===
        "channel:market:btcusdt"
      ) {
        wss.clients.forEach(
          (client) => {
            if (
              client.readyState === WebSocket.OPEN
            ) {
              client.send(message);
            }
          }
        );
      }
    }
  );
}