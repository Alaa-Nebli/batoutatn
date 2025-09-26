-- CreateTable
CREATE TABLE "TimelineImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tripTimelineId" TEXT,
    "programTimelineId" TEXT,

    CONSTRAINT "TimelineImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimelineImage_tripTimelineId_idx" ON "TimelineImage"("tripTimelineId");

-- CreateIndex
CREATE INDEX "TimelineImage_programTimelineId_idx" ON "TimelineImage"("programTimelineId");

-- AddForeignKey
ALTER TABLE "TimelineImage" ADD CONSTRAINT "TimelineImage_tripTimelineId_fkey" FOREIGN KEY ("tripTimelineId") REFERENCES "TripTimeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineImage" ADD CONSTRAINT "TimelineImage_programTimelineId_fkey" FOREIGN KEY ("programTimelineId") REFERENCES "ProgramTimeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
