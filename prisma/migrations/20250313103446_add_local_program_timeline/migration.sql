-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metadata" TEXT,
    "description" TEXT NOT NULL,
    "images" JSONB NOT NULL,
    "location_from" TEXT NOT NULL,
    "location_to" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "display" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripTimeline" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Featured" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Featured_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalProgram" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metadata" TEXT,
    "description" TEXT NOT NULL,
    "images" JSONB NOT NULL,
    "location_from" TEXT NOT NULL,
    "location_to" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramTimeline" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_title_key" ON "Trip"("title");

-- CreateIndex
CREATE UNIQUE INDEX "LocalProgram_title_key" ON "LocalProgram"("title");

-- AddForeignKey
ALTER TABLE "TripTimeline" ADD CONSTRAINT "TripTimeline_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Featured" ADD CONSTRAINT "Featured_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramTimeline" ADD CONSTRAINT "ProgramTimeline_programId_fkey" FOREIGN KEY ("programId") REFERENCES "LocalProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
