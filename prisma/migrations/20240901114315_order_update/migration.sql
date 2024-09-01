/*
  Warnings:

  - Added the required column `itemsPrePrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "itemsPrePrice" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "shippingPrice" DROP NOT NULL,
ALTER COLUMN "taxPrice" DROP NOT NULL,
ALTER COLUMN "totalPrice" DROP NOT NULL;
