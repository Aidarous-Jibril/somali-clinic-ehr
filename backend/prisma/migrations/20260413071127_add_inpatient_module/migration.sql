/*
  Warnings:

  - You are about to drop the `inpatient_stays` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inpatient_stays" DROP CONSTRAINT "inpatient_stays_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "inpatient_stays" DROP CONSTRAINT "inpatient_stays_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "inpatient_stays" DROP CONSTRAINT "inpatient_stays_patientId_fkey";

-- DropForeignKey
ALTER TABLE "inpatient_stays" DROP CONSTRAINT "inpatient_stays_unitId_fkey";

-- DropTable
DROP TABLE "inpatient_stays";

-- CreateTable
CREATE TABLE "InpatientStay" (
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
    "technicalUnit" TEXT,
    "activity" TEXT,
    "absence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InpatientStay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InpatientStay_clinicId_idx" ON "InpatientStay"("clinicId");

-- CreateIndex
CREATE INDEX "InpatientStay_patientId_idx" ON "InpatientStay"("patientId");

-- CreateIndex
CREATE INDEX "InpatientStay_dischargedAt_idx" ON "InpatientStay"("dischargedAt");

-- AddForeignKey
ALTER TABLE "InpatientStay" ADD CONSTRAINT "InpatientStay_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InpatientStay" ADD CONSTRAINT "InpatientStay_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InpatientStay" ADD CONSTRAINT "InpatientStay_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InpatientStay" ADD CONSTRAINT "InpatientStay_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
