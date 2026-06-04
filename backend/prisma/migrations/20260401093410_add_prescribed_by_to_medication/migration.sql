/*
  Warnings:

  - Made the column `prescribedByStaffId` on table `Medication` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_prescribedByStaffId_fkey";

-- AlterTable
ALTER TABLE "Medication" ALTER COLUMN "prescribedByStaffId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_prescribedByStaffId_fkey" FOREIGN KEY ("prescribedByStaffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
