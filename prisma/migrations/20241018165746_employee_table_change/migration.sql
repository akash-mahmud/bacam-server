/*
  Warnings:

  - You are about to drop the column `role` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "role",
ADD COLUMN     "employeeCategoryId" TEXT,
ADD COLUMN     "employeeSubCategoryId" TEXT;

-- CreateTable
CREATE TABLE "EmployeeCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employeeCategoryId" TEXT NOT NULL,

    CONSTRAINT "EmployeeSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeCategory_slug_key" ON "EmployeeCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSubCategory_slug_key" ON "EmployeeSubCategory"("slug");

-- AddForeignKey
ALTER TABLE "EmployeeSubCategory" ADD CONSTRAINT "EmployeeSubCategory_employeeCategoryId_fkey" FOREIGN KEY ("employeeCategoryId") REFERENCES "EmployeeCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employeeCategoryId_fkey" FOREIGN KEY ("employeeCategoryId") REFERENCES "EmployeeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employeeSubCategoryId_fkey" FOREIGN KEY ("employeeSubCategoryId") REFERENCES "EmployeeSubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
