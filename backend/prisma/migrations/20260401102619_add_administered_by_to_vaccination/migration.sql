/*
  Warnings:

  - Made the column `administeredByStaffId` on table `Vaccination` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Vaccination" DROP CONSTRAINT "Vaccination_administeredByStaffId_fkey";

-- AlterTable
ALTER TABLE "Vaccination" ALTER COLUMN "administeredByStaffId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_administeredByStaffId_fkey" FOREIGN KEY ("administeredByStaffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
