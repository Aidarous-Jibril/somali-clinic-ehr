-- CreateEnum
CREATE TYPE "FluidIntakeSource" AS ENUM ('oral', 'enteral', 'medication');

-- CreateEnum
CREATE TYPE "FluidOutputSource" AS ENUM ('urine', 'bleeding', 'faeces', 'vomiting', 'other');

-- CreateTable
CREATE TABLE "FluidBalanceEntry" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "encounterId" TEXT,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "intakeMl" INTEGER NOT NULL,
    "outputMl" INTEGER NOT NULL,
    "balanceMl" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FluidBalanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FluidBalanceDetails" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "oralMl" INTEGER NOT NULL DEFAULT 0,
    "oralKcal" INTEGER NOT NULL DEFAULT 0,
    "enteralMl" INTEGER NOT NULL DEFAULT 0,
    "enteralKcal" INTEGER NOT NULL DEFAULT 0,
    "urineMl" INTEGER NOT NULL DEFAULT 0,
    "bleedingMl" INTEGER NOT NULL DEFAULT 0,
    "faecesMl" INTEGER NOT NULL DEFAULT 0,
    "vomitingMl" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FluidBalanceDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FluidBalanceEntry_patientId_idx" ON "FluidBalanceEntry"("patientId");

-- CreateIndex
CREATE INDEX "FluidBalanceEntry_measuredAt_idx" ON "FluidBalanceEntry"("measuredAt");

-- CreateIndex
CREATE UNIQUE INDEX "FluidBalanceDetails_entryId_key" ON "FluidBalanceDetails"("entryId");

-- AddForeignKey
ALTER TABLE "FluidBalanceEntry" ADD CONSTRAINT "FluidBalanceEntry_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FluidBalanceEntry" ADD CONSTRAINT "FluidBalanceEntry_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FluidBalanceDetails" ADD CONSTRAINT "FluidBalanceDetails_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "FluidBalanceEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
