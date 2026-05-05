import { redis } from "@repo/redis"

export const CALLBACK_QUEUE = "callback-queue";

export class RedisSubscriber {
  private client
  private callbacks: Record<string, (data: Record<string, string>) => void>;

  constructor() {
    this.client = redis.duplicate();
    this.callbacks = {};
    this.runLoop();
  }

  async runLoop() {
    while (true) {
      try {
        const response = await this.client.xread(
          "BLOCK",
          0,
          "STREAMS",
          CALLBACK_QUEUE,
          "$"
        );
        if (!response || response.length === 0) continue;

        const [, messages] = response[0]!;
        if (!messages || messages.length === 0) continue;

        for (const [id, rawFields] of messages) {
          const fields = rawFields as string[];

          const data: Record<string, string> = {};
          for (let i = 0; i < fields.length; i += 2){
                const key = fields[i];
                const value = fields[i+1];

                if (key && value) {
                    data[key] = value;
                }
          }

          const callbackId = data.id;
          console.log(`Received callback:`, data);

          const fn = callbackId ? this.callbacks[callbackId] : undefined;
          if (fn) {
            fn(data);
            delete this.callbacks[callbackId!];
          } else {
            console.log(`No controller found for id: ${callbackId}`);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  waitForMessage(callbackId: string) {
    return new Promise<Record<string, string>>((resolve, reject) => {
      console.log("Waiting for callback id");

      const timer = setTimeout(() => {
        if (this.callbacks[callbackId]) {
          delete this.callbacks[callbackId];
          reject(new Error("Timeout waiting for message"));
        }
      }, 5000);

      this.callbacks[callbackId] = (data: Record<string, string>) => {
        clearTimeout(timer);
        resolve(data);
      };
    });
  }
}
