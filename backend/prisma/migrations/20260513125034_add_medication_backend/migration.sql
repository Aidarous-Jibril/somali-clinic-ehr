-- CreateEnum
CREATE TYPE "MedicationGroupType" AS ENUM ('current', 'prn', 'notScheduled', 'generalDirective');

-- CreateEnum
CREATE TYPE "MedicationRoute" AS ENUM ('oral', 'intravenous', 'intramuscular', 'subcutaneous', 'inhalation', 'topical', 'rectal', 'ophthalmic', 'otic', 'nasal', 'other');

-- CreateEnum
CREATE TYPE "MedicationDoseStatus" AS ENUM ('planned', 'prepared', 'given', 'missed', 'skipped', 'selfAdmin', 'notNeeded');

-- CreateEnum
CREATE TYPE "MedicationAdministrationAction" AS ENUM ('prepare', 'administer', 'selfAdminister', 'skip');

-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "dosingText" TEXT,
ADD COLUMN     "form" TEXT,
ADD COLUMN     "groupType" "MedicationGroupType" NOT NULL DEFAULT 'current',
ADD COLUMN     "indication" TEXT,
ADD COLUMN     "route" "MedicationRoute",
ADD COLUMN     "tooltip" TEXT;

-- CreateTable
CREATE TABLE "MedicationDose" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "tooltip" TEXT,
    "isPrn" BOOLEAN NOT NULL DEFAULT false,
    "status" "MedicationDoseStatus" NOT NULL DEFAULT 'planned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationDose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationAdministration" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "doseId" TEXT,
    "action" "MedicationAdministrationAction" NOT NULL,
    "administeredDose" TEXT,
    "batchNumber" TEXT,
    "comment" TEXT,
    "reason" TEXT,
    "performedByAccountId" TEXT,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationAdministration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicationDose_medicationId_idx" ON "MedicationDose"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationDose_scheduledDate_idx" ON "MedicationDose"("scheduledDate");

-- CreateIndex
CREATE INDEX "MedicationDose_status_idx" ON "MedicationDose"("status");

-- CreateIndex
CREATE INDEX "MedicationAdministration_medicationId_idx" ON "MedicationAdministration"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationAdministration_doseId_idx" ON "MedicationAdministration"("doseId");

-- CreateIndex
CREATE INDEX "MedicationAdministration_performedAt_idx" ON "MedicationAdministration"("performedAt");

-- CreateIndex
CREATE INDEX "Medication_status_idx" ON "Medication"("status");

-- CreateIndex
CREATE INDEX "Medication_groupType_idx" ON "Medication"("groupType");

-- AddForeignKey
ALTER TABLE "MedicationDose" ADD CONSTRAINT "MedicationDose_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationAdministration" ADD CONSTRAINT "MedicationAdministration_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationAdministration" ADD CONSTRAINT "MedicationAdministration_doseId_fkey" FOREIGN KEY ("doseId") REFERENCES "MedicationDose"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationAdministration" ADD CONSTRAINT "MedicationAdministration_performedByAccountId_fkey" FOREIGN KEY ("performedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
