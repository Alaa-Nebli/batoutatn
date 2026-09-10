/*
  Warnings:

  - You are about to drop the column `metadata` on the `LocalProgram` table. All the data in the column will be lost.
  - You are about to drop the column `priceExclude` on the `LocalProgram` table. All the data in the column will be lost.
  - You are about to drop the column `priceInclude` on the `LocalProgram` table. All the data in the column will be lost.
  - You are about to drop the column `singleAdon` on the `LocalProgram` table. All the data in the column will be lost.
  - The `generalConditions` column on the `LocalProgram` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentConditions` column on the `LocalProgram` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cancellationTerms` column on the `LocalProgram` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `programTimelineId` on the `TimelineImage` table. All the data in the column will be lost.
  - You are about to drop the `ProgramTimeline` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `LocalProgram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nights` to the `LocalProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `LocalProgram` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProgramTimeline" DROP CONSTRAINT "ProgramTimeline_programId_fkey";

-- DropForeignKey
ALTER TABLE "TimelineImage" DROP CONSTRAINT "TimelineImage_programTimelineId_fkey";

-- DropIndex
DROP INDEX "LocalProgram_title_key";

-- DropIndex
DROP INDEX "TimelineImage_programTimelineId_idx";

-- AlterTable
ALTER TABLE "LocalProgram" DROP COLUMN "metadata",
DROP COLUMN "priceExclude",
DROP COLUMN "priceInclude",
DROP COLUMN "singleAdon",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'TND',
ADD COLUMN     "excludes" JSONB,
ADD COLUMN     "includes" JSONB,
ADD COLUMN     "nights" INTEGER NOT NULL,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "singleAddonPrice" DOUBLE PRECISION,
ADD COLUMN     "slug" TEXT NOT NULL,
DROP COLUMN "generalConditions",
ADD COLUMN     "generalConditions" JSONB,
DROP COLUMN "paymentConditions",
ADD COLUMN     "paymentConditions" JSONB,
DROP COLUMN "cancellationTerms",
ADD COLUMN     "cancellationTerms" JSONB;

-- AlterTable
ALTER TABLE "TimelineImage" DROP COLUMN "programTimelineId";

-- DropTable
DROP TABLE "ProgramTimeline";

-- CreateTable
CREATE TABLE "ProgramDay" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "summary" TEXT,
    "highlight" TEXT,
    "hotel" TEXT,
    "meals" JSONB,
    "tags" JSONB,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramActivity" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "time" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "location" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalProgram_slug_key" ON "LocalProgram"("slug");

-- AddForeignKey
ALTER TABLE "ProgramDay" ADD CONSTRAINT "ProgramDay_programId_fkey" FOREIGN KEY ("programId") REFERENCES "LocalProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramActivity" ADD CONSTRAINT "ProgramActivity_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "ProgramDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
