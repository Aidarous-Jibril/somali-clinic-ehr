-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "sourcePatientId" TEXT;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_sourcePatientId_fkey" FOREIGN KEY ("sourcePatientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
