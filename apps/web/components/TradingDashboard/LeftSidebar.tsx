"use client";

import useMarketPrice from "@/hooks/useMarketPrice";
import Image from "next/image";

export default function LeftSidebar() {
  const { marketPrice } = useMarketPrice();

  return (
    <div className="p-4 border-r h-full">
      <h2 className="text-lg font-bold mb-4 flex">
        <Image 
          src="/bitcoin.png"
          alt="bitcoin"
          width={30}
          height={30}
        />
        <p className="ml-3 items-center justify-between">BTC-PERP</p>
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-zinc-400">
            Bid Price
          </p>

          <p className="text-xl font-semibold">
            {marketPrice?.bid ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">
            Ask Price
          </p>

          <p className="text-xl font-semibold">
            {marketPrice?.ask ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}