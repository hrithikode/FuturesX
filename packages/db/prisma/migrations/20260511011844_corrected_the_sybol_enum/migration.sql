/*
  Warnings:

  - The values [USDT,BTC] on the enum `Symbol` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Symbol_new" AS ENUM ('BTCUSDT', 'ETHUSDT', 'SOLUSDT');
ALTER TABLE "Asset" ALTER COLUMN "symbol" TYPE "Symbol_new" USING ("symbol"::text::"Symbol_new");
ALTER TABLE "Order" ALTER COLUMN "symbol" TYPE "Symbol_new" USING ("symbol"::text::"Symbol_new");
ALTER TYPE "Symbol" RENAME TO "Symbol_old";
ALTER TYPE "Symbol_new" RENAME TO "Symbol";
DROP TYPE "public"."Symbol_old";
COMMIT;
