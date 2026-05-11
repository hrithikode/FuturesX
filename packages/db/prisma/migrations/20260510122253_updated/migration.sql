/*
  Warnings:

  - You are about to drop the column `closeReason` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `closingPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `decimals` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pnl` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `stopLoss` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `takeProfit` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "closeReason",
DROP COLUMN "closingPrice",
DROP COLUMN "decimals",
DROP COLUMN "pnl",
DROP COLUMN "stopLoss",
DROP COLUMN "takeProfit",
ADD COLUMN     "priceDecimals" INTEGER NOT NULL DEFAULT 4,
ALTER COLUMN "qtyDecimals" SET DEFAULT 8;

-- DropEnum
DROP TYPE "CloseReason";
