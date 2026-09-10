/*
  Warnings:

  - You are about to drop the column `mapPoints` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "mapPoints",
ADD COLUMN     "mapEmbedUrl" TEXT;
