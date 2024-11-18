/*
  Warnings:

  - You are about to drop the `ProductFteaures` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductFteaures" DROP CONSTRAINT "ProductFteaures_fetaurecategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFteaures" DROP CONSTRAINT "ProductFteaures_productId_fkey";

-- DropTable
DROP TABLE "ProductFteaures";

-- CreateTable
CREATE TABLE "ProductFetaure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "fetaurecategoryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductFetaure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductFetaure" ADD CONSTRAINT "ProductFetaure_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFetaure" ADD CONSTRAINT "ProductFetaure_fetaurecategoryId_fkey" FOREIGN KEY ("fetaurecategoryId") REFERENCES "FetaureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
