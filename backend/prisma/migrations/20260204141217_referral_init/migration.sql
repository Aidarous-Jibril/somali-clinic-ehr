-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('unassessed', 'accepted', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "ReferralRole" AS ENUM ('Doctor', 'Nurse', 'Physiotherapist', 'OccupationalTherapist', 'Dietitian', 'SpeechTherapist', 'Midwife', 'Other');

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "encounterId" TEXT,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "sentByRole" "ReferralRole" NOT NULL,
    "sentByName" TEXT NOT NULL,
    "sentByUnit" TEXT,
    "status" "ReferralStatus" NOT NULL DEFAULT 'unassessed',
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "hasAdditionalInfo" BOOLEAN NOT NULL DEFAULT false,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Referral_patientId_idx" ON "Referral"("patientId");

-- CreateIndex
CREATE INDEX "Referral_clinicId_idx" ON "Referral"("clinicId");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
