-- DropForeignKey
ALTER TABLE "Vaccination" DROP CONSTRAINT "Vaccination_administeredByStaffId_fkey";

-- AlterTable
ALTER TABLE "Vaccination" ALTER COLUMN "administeredByStaffId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_administeredByStaffId_fkey" FOREIGN KEY ("administeredByStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
