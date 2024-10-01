-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "orderStartPrice" DROP NOT NULL,
ALTER COLUMN "orderStartPrice" SET DEFAULT 0;
