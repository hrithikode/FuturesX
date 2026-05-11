/*
  Warnings:

  - Changed the type of `symbol` on the `Asset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AssetSymbol" AS ENUM ('USDT');

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "symbol",
ADD COLUMN     "symbol" "AssetSymbol" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_userId_symbol_key" ON "Asset"("userId", "symbol");
