-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "shortdescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
