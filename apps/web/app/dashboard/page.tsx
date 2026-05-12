"use client";

import { useState, useEffect } from "react";
import api from "../lib/axios";
import axios from "axios";

type Order = {
  id: string;
  symbol: string;
  side: "long" | "short";
  leverage: number;
  qty: number;
  qtyDecimals: number;
};

export default function Dashboard() {
  const [quantity, setQuantity] = useState("");
  const [leverage, setLeverage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([])
  const [balance, setBalance] = useState(0);

  // temporary frontend display price
  // later this will come from poller service
  const btcPrice = 95000;

    const fetchBalance = async () => {
  try {
    const response =
      await api.get("/balance");

    setBalance(
      response.data.availableBalance
    );
  } catch (error) {
    console.error(error);
  }
};

    const fetchOrders = async () => {
    try {
        const response =
        await api.get<{orders: Order[]}>(
            "/trade/orders"
        );

        setOrders(
        response.data.orders
        );
    } catch (error) {
        console.error(error);
    }
};

useEffect(() => {
  fetchOrders();
  fetchBalance();
}, []);

const handleCloseOrder = async (
  orderId: string
) => {
  try {
    await api.post(
      `/trade/close/${orderId}`
    );

    alert("Order closed");

    await fetchOrders();
    await fetchBalance();
  } catch (error) {
    console.error(error);
    alert("Close order failed");
  }
};

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
            
        try {
            await api.post(
            "/trade/create",
            {
                symbol: "BTCUSDT",
                side,
                qty: Number(quantity),
                leverage,
            },
            );

            alert("Order created");
            await fetchOrders();
            await fetchBalance();
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
        <p className="text-sm text-green-400 mt-2">
            Available Balance: ${balance}
        </p>
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

       <div className="space-y-3">
  <h2 className="text-xl font-semibold">
    Open Orders
  </h2>

  {orders.map((order) => (
    <div
      key={order.id}
      className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between"
    >
      <div>
        <p
          className={`font-semibold ${
            order.side === "long"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {String(order.side).toUpperCase()}
        </p>

        <p className="text-sm text-zinc-400">
          {order.symbol} •{" "}
          {order.qty /
            Math.pow(
              10,
              order.qtyDecimals
            )} BTC
        </p>
      </div>

      <div className="text-right space-y-2">
  <p className="font-bold">
    {order.leverage}x
  </p>

  <p className="text-sm text-zinc-400">
    Leverage
  </p>

  <button
    onClick={() =>
      handleCloseOrder(order.id)
    }
    className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm font-semibold"
  >
    Close
  </button>
</div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}