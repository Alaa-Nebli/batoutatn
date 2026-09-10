-- Extend LocalProgram into the public "Programme en Tunisie" product model.
ALTER TABLE "LocalProgram"
ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'MULTI_DAY_CIRCUIT',
ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN IF NOT EXISTS "highlights" JSONB,
ADD COLUMN IF NOT EXISTS "videoUrl" TEXT,
ADD COLUMN IF NOT EXISTS "meetingPoint" TEXT,
ADD COLUMN IF NOT EXISTS "destinations" JSONB,
ADD COLUMN IF NOT EXISTS "priceLabel" TEXT,
ADD COLUMN IF NOT EXISTS "durationLabel" TEXT,
ADD COLUMN IF NOT EXISTS "isDateFlexible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "childPrice" DOUBLE PRECISION;

CREATE TABLE IF NOT EXISTS "ProgramReservation" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "numberOfPersons" INTEGER NOT NULL,
    "roomType" TEXT,
    "specialRequests" TEXT,
    "preferredDate" TEXT,
    "totalPrice" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramReservation_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ProgramReservation_programId_fkey'
  ) THEN
    ALTER TABLE "ProgramReservation"
    ADD CONSTRAINT "ProgramReservation_programId_fkey"
    FOREIGN KEY ("programId") REFERENCES "LocalProgram"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "ProgramReservation_programId_idx" ON "ProgramReservation"("programId");
CREATE INDEX IF NOT EXISTS "ProgramReservation_status_idx" ON "ProgramReservation"("status");
CREATE INDEX IF NOT EXISTS "ProgramReservation_createdAt_idx" ON "ProgramReservation"("createdAt");
