-- Add phone field to Trip table (if it doesn't exist)
ALTER TABLE "Trip" ADD COLUMN IF NOT EXISTS "phone" TEXT;