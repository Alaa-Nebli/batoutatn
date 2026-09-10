-- AlterTable
ALTER TABLE "LocalProgram"
ADD COLUMN "display" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "generalConditions" TEXT,
ADD COLUMN "priceInclude" TEXT,
ADD COLUMN "priceExclude" TEXT,
ADD COLUMN "paymentConditions" TEXT,
ADD COLUMN "cancellationTerms" TEXT,
ADD COLUMN "mapEmbedUrl" TEXT,
ADD COLUMN "singleAdon" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "phone" TEXT,
ADD COLUMN "whatsappNumber" TEXT;
