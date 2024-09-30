/*
  Warnings:

  - Added the required column `custom_product_status` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimumOrderNeededToStart` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('readyMate', 'custom');

-- CreateEnum
CREATE TYPE "CustomProductStatus" AS ENUM ('minimum_order_needed', 'started');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "custom_product_status" "CustomProductStatus" NOT NULL,
ADD COLUMN     "minimumOrderNeededToStart" INTEGER NOT NULL,
ADD COLUMN     "status" "ProductStatus" NOT NULL;
