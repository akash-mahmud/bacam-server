/*
  Warnings:

  - You are about to drop the column `fetaureFile` on the `News` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "fetaureFile",
ADD COLUMN     "fetaureMedias" TEXT[],
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
