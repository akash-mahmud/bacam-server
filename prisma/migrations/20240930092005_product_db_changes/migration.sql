-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'one_time_payment_success';

-- DropIndex
DROP INDEX "OrderItem_orderId_key";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "itemsPrePrice" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "DefaultShippingAdress" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "shippingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lng" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DefaultShippingAdress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DefaultShippingAdress_userId_key" ON "DefaultShippingAdress"("userId");

-- AddForeignKey
ALTER TABLE "DefaultShippingAdress" ADD CONSTRAINT "DefaultShippingAdress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
