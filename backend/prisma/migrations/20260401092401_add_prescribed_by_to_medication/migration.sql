-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "prescribedByStaffId" TEXT;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_prescribedByStaffId_fkey" FOREIGN KEY ("prescribedByStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
