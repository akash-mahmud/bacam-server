/*
  Warnings:

  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.
  - Added the required column `type` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('readyMate', 'custom');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
ADD COLUMN     "type" "ProductType" NOT NULL;

-- DropEnum
DROP TYPE "ProductStatus";
