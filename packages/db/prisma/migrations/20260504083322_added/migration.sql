-- CreateEnum
CREATE TYPE "Side" AS ENUM ('long', 'short');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "CloseReason" AS ENUM ('takeProfit', 'StopLoass', 'Manual', 'Liquidation');

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "side" "Side" NOT NULL,
    "pnl" INTEGER NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 4,
    "openingPrice" INTEGER NOT NULL,
    "closingPrice" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "qty" INTEGER NOT NULL,
    "qtyDecimals" INTEGER NOT NULL DEFAULT 2,
    "leverage" INTEGER NOT NULL DEFAULT 1,
    "takeProfit" INTEGER,
    "stopLoss" INTEGER,
    "margin" INTEGER NOT NULL,
    "closeReason" "CloseReason",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
