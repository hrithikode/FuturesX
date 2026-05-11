"use client";

import { useState } from "react";
import api from "../lib/axios";
import axios from "axios";

export default function Dashboard() {
  const [quantity, setQuantity] = useState("");
  const [leverage, setLeverage] = useState(1);

  // temporary frontend display price
  // later this will come from poller service
  const btcPrice = 95000;

  // estimated margin for frontend preview
  const estimatedMargin =
    quantity && leverage
      ? (
          (Number(quantity) * btcPrice) /
          leverage
        ).toFixed(2)
      : "0";


    const handleCreateOrder = async (
        side: "long" | "short"
        ) => {
            console.log("Button clicked");
console.log({
  symbol: "BTCUSDT",
  side,
  qty: Number(quantity),
  leverage
});
        try {
            await api.post(
            "/trade/create",
            {
                symbol: "BTCUSDT",
                asset: "BTC",
                side,
                qty: Number(quantity),
                leverage,
            },
            );

            alert("Order created");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error(error);
                console.error("FULL ERROR:", error);
                console.log("Response:", error.response);
            } else {
                console.error(error);
            }

            alert("Order failed");
        }
    };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            BTC-USDT
          </h1>

          <p className="text-zinc-400 mt-1">
            Live Price: ${btcPrice}
          </p>

          <p className="text-sm text-zinc-500 mt-2">
            Estimated margin shown here.
            Final margin is validated by backend.
          </p>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">
            Quantity (BTC)
          </label>

          <input
            type="number"
            placeholder="0.01"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        {/* Leverage Select */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">
            Leverage
          </label>

          <select
            value={leverage}
            onChange={(e) =>
              setLeverage(
                Number(e.target.value)
              )
            }
            className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          >
            {[1, 2, 5, 10].map((value) => (
              <option
                key={value}
                value={value}
              >
                {value}x
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Margin */}
        <div className="bg-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">
            Estimated Required Margin
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ${estimatedMargin}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleCreateOrder("long")} className="bg-green-500 text-black font-bold p-3 rounded-xl">
            Long
          </button>

          <button onClick={() => handleCreateOrder("short")} className="bg-red-500 text-white font-bold p-3 rounded-xl">
            Short
          </button>
        </div>

        {/* Simple Order Preview */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">
            Open Orders
          </h2>

          <div className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-500">
                LONG
              </p>

              <p className="text-sm text-zinc-400">
                BTC-USDT • 0.1 BTC
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">
                10x
              </p>

              <p className="text-sm text-zinc-400">
                Leverage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}