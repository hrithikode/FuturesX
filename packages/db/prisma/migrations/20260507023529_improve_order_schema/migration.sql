/*
  Warnings:

  - The values [StopLoass] on the enum `CloseReason` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `symbol` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CloseReason_new" AS ENUM ('takeProfit', 'StopLoss', 'Manual', 'Liquidation');
ALTER TABLE "Order" ALTER COLUMN "closeReason" TYPE "CloseReason_new" USING ("closeReason"::text::"CloseReason_new");
ALTER TYPE "CloseReason" RENAME TO "CloseReason_old";
ALTER TYPE "CloseReason_new" RENAME TO "CloseReason";
DROP TYPE "public"."CloseReason_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "symbol" "Symbol" NOT NULL,
ALTER COLUMN "closingPrice" DROP NOT NULL;
