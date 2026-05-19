import WebSocket from "ws";
import { redis } from "@repo/redis";

const SYMBOL = "BTCUSDT";

const ws = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcusdt@bookTicker"
);

ws.on("open", () => {
  console.log(
    "Connected to Binance WebSocket"
  );
});

ws.on("message", async (message) => {
  try {
    const data = JSON.parse(
      message.toString()
    );

    const bestBid = Number(data.b);
    const bestAsk = Number(data.a);

    const payload = {
      symbol: SYMBOL,
      bid: bestBid,
      ask: bestAsk,
      timestamp: Date.now(),
    };

    await redis.set(
      `price:${SYMBOL}`,
      JSON.stringify(payload)
    );

    await redis.publish(
      `channel:market:${SYMBOL.toLowerCase()}`,
      JSON.stringify(payload)
    );

  } catch (error) {
    console.error(
      "Market Service Error:",
      error
    );
  }
});

ws.on("error", (error) => {
  console.error(
    "Binance WS Error",
    error
  );
});

ws.on("close", () => {
  console.log(
    "Binance WS Closed"
  );
});