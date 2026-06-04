/*
  Warnings:

  - Made the column `encounterId` on table `JournalTable` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "JournalTable" DROP CONSTRAINT "JournalTable_encounterId_fkey";

-- AlterTable
ALTER TABLE "JournalTable" ALTER COLUMN "encounterId" SET NOT NULL;

-- CreateTable
CREATE TABLE "inpatient_stays" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "encounterId" TEXT,
    "unitId" TEXT,
    "bedCode" TEXT NOT NULL,
    "team" TEXT,
    "ews" INTEGER,
    "admittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dischargedAt" TIMESTAMP(3),
    "plannedDischargeAt" TIMESTAMP(3),
    "plannedDischargeStatus" TEXT,
    "activity" TEXT,
    "absence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inpatient_stays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inpatient_stays_clinicId_idx" ON "inpatient_stays"("clinicId");

-- CreateIndex
CREATE INDEX "inpatient_stays_patientId_idx" ON "inpatient_stays"("patientId");

-- CreateIndex
CREATE INDEX "inpatient_stays_dischargedAt_idx" ON "inpatient_stays"("dischargedAt");

-- AddForeignKey
ALTER TABLE "JournalTable" ADD CONSTRAINT "JournalTable_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inpatient_stays" ADD CONSTRAINT "inpatient_stays_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inpatient_stays" ADD CONSTRAINT "inpatient_stays_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inpatient_stays" ADD CONSTRAINT "inpatient_stays_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inpatient_stays" ADD CONSTRAINT "inpatient_stays_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
