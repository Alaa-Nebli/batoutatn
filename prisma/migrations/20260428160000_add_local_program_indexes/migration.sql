CREATE INDEX IF NOT EXISTS "LocalProgram_display_status_idx" ON "LocalProgram"("display", "status");
CREATE INDEX IF NOT EXISTS "LocalProgram_type_idx" ON "LocalProgram"("type");
CREATE INDEX IF NOT EXISTS "LocalProgram_featured_idx" ON "LocalProgram"("featured");
CREATE INDEX IF NOT EXISTS "LocalProgram_sortOrder_idx" ON "LocalProgram"("sortOrder");
CREATE INDEX IF NOT EXISTS "ProgramDay_programId_order_idx" ON "ProgramDay"("programId", "order");
CREATE INDEX IF NOT EXISTS "ProgramActivity_dayId_order_idx" ON "ProgramActivity"("dayId", "order");
