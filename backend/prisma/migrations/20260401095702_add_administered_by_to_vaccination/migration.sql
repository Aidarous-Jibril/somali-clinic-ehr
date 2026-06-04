-- AlterTable
ALTER TABLE "Vaccination" ADD COLUMN     "administeredByStaffId" TEXT;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_administeredByStaffId_fkey" FOREIGN KEY ("administeredByStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
