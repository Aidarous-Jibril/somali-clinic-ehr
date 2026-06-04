/*
  Warnings:

  - You are about to drop the column `recordedBy` on the `ClinicalParameterEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClinicalParameterEntry" DROP COLUMN "recordedBy",
ADD COLUMN     "recordedByAccountId" TEXT;

-- AddForeignKey
ALTER TABLE "ClinicalParameterEntry" ADD CONSTRAINT "ClinicalParameterEntry_recordedByAccountId_fkey" FOREIGN KEY ("recordedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
