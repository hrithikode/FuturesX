"use client";

import { useEffect, useState } from "react";

type MarketPrice = {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: number;
};

export default function useMarketPrice() {

  const [marketPrice, setMarketPrice] = useState<MarketPrice | null>(null);

  useEffect(() => {
    console.log("creating webSocket...");
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Connected to WS");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(
          event.data
        );

        setMarketPrice(data);

      } catch (error) {
        console.error(
          "WS Parse Error:", error
        );
      }
    };

    ws.onerror = () => {
      console.error("WebSocket connection failed"
      );
    };

    ws.onclose = (event) => {
      console.log("WS Closed", event.code, event.reason);
    };

    return () => {
      ws.close();
    };
  }, []);

  return {
    marketPrice,
  };
}