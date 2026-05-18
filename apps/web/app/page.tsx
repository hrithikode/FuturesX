"use client"

import { useRouter } from "next/navigation";

export default function LandingPage() {

  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">PerpX</h1>

          <button 
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
            onClick={() => router.push("/register")}>
            Get Started
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div className="space-y-8">
          <p className="inline-block rounded-full border px-4 py-2 text-sm font-medium text-gray-600">
            Trade Smarter, Faster
          </p>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Next-Gen Crypto <br /> Trading Platform
          </h2>

          <p className="max-w-xl text-lg text-gray-600">
            Trade cryptocurrencies with real-time market data
            and powerful perpetual trading tools.
          </p>

          <div className="flex gap-4">
            <button 
              className="rounded-2xl bg-black px-8 py-4 text-base font-semibold text-white transition hover:opacity-90 cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
