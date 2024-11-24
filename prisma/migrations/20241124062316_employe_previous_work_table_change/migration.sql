/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `EmployeePreviousWork` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `EmployeePreviousWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `EmployeePreviousWork` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeePreviousWork" ADD COLUMN     "employeeId" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmployeePreviousWork_slug_key" ON "EmployeePreviousWork"("slug");

-- AddForeignKey
ALTER TABLE "EmployeePreviousWork" ADD CONSTRAINT "EmployeePreviousWork_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
