-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "size" TEXT[];

-- CreateTable
CREATE TABLE "FetaureCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT,

    CONSTRAINT "FetaureCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFteaures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "fetaurecategoryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductFteaures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FetaureCategory" ADD CONSTRAINT "FetaureCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFteaures" ADD CONSTRAINT "ProductFteaures_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFteaures" ADD CONSTRAINT "ProductFteaures_fetaurecategoryId_fkey" FOREIGN KEY ("fetaurecategoryId") REFERENCES "FetaureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
