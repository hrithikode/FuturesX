import { redis } from "@repo/redis";
import { createOrder } from "./handlers/createOrder.js";
import { closeOrder } from "./handlers/closeOrder.js";
import "./poller.js"
const ENGINE_STREAM = "engine-stream";

const engineRedis = redis.duplicate();

async function startEngine() {
  console.log("Engine started...");

  while (true) {
    try {
      const response = await engineRedis.xread(
        "BLOCK",
        0,
        "STREAMS",
        ENGINE_STREAM,
        "$"
      );

      if (!response || response.length === 0) continue;

      const [, messages] = response[0]!;

      if (!messages || messages.length === 0) continue;

      for (const [id, rawFields] of messages) {
        const fields = rawFields as string[];

        const data: Record<string, string> = {};

        for (let i = 0; i < fields.length; i += 2) {
          const key = fields[i];
          const value = fields[i + 1];

          if (key && value) {
            data[key] = value;
          }
        }

        if (!data.data) {
          console.log("Invalid message");
          continue;
        }

        const parsedMessage = JSON.parse(data.data);

        console.log("Received from engine-stream:", parsedMessage);

        if (parsedMessage.action === "create-order") {
          await createOrder(parsedMessage.payload);
        }
        if (parsedMessage.action === "close-order") {
          await closeOrder(parsedMessage.payload);
        }
      }
    } catch (error) {
      console.error("Engine Error:", error);
    }
  }
}

startEngine();

