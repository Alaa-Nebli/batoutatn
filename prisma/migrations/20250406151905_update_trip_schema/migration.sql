/*
  Warnings:

  - Added the required column `generalConditions` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceInclude` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `singleAdon` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "generalConditions" TEXT NOT NULL,
ADD COLUMN     "priceInclude" TEXT NOT NULL,
ADD COLUMN     "singleAdon" INTEGER NOT NULL;
