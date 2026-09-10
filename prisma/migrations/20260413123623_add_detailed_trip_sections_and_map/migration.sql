-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "cancellationTerms" TEXT,
ADD COLUMN     "mapPoints" JSONB,
ADD COLUMN     "paymentConditions" TEXT,
ADD COLUMN     "priceExclude" TEXT;
