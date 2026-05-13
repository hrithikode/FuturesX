import { redis } from "@repo/redis";

async function startPoller() {
  console.log("Price Poller started...");

  while (true) {
    try {
      const currentPrice = 62000 + Math.floor(Math.random() * 1000);

      await redis.set("price:BTCUSDT", currentPrice.toString());

      console.log( "Updated BTC Price:", currentPrice);
     
      await new Promise((resolve) =>
          setTimeout( resolve, 5000 )
      );
    } catch (error) {
      console.error( "Poller Error:", error
      );
    }
  }
}

startPoller();