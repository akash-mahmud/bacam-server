/*
  Warnings:

  - Made the column `shippingPrice` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taxPrice` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalPrice` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "shippingPrice" SET NOT NULL,
ALTER COLUMN "shippingPrice" SET DEFAULT 0,
ALTER COLUMN "taxPrice" SET NOT NULL,
ALTER COLUMN "taxPrice" SET DEFAULT 0,
ALTER COLUMN "totalPrice" SET NOT NULL;
