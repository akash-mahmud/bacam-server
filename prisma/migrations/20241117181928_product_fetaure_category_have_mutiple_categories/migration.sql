/*
  Warnings:

  - You are about to drop the column `productId` on the `FetaureCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FetaureCategory" DROP CONSTRAINT "FetaureCategory_productId_fkey";

-- AlterTable
ALTER TABLE "FetaureCategory" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "_FetaureCategoryToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FetaureCategoryToProduct_AB_unique" ON "_FetaureCategoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FetaureCategoryToProduct_B_index" ON "_FetaureCategoryToProduct"("B");

-- AddForeignKey
ALTER TABLE "_FetaureCategoryToProduct" ADD CONSTRAINT "_FetaureCategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "FetaureCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FetaureCategoryToProduct" ADD CONSTRAINT "_FetaureCategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
