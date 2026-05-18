/*
  Warnings:

  - You are about to drop the column `settlement` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "settlement",
ADD COLUMN     "finalSettlement" INTEGER;
