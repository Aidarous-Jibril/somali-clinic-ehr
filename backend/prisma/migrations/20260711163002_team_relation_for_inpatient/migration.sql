/*
  Warnings:

  - You are about to drop the column `team` on the `InpatientStay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InpatientStay" DROP COLUMN "team",
ADD COLUMN     "teamId" TEXT;

-- AddForeignKey
ALTER TABLE "InpatientStay" ADD CONSTRAINT "InpatientStay_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
