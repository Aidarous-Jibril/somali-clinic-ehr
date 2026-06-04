-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'awaiting_result';

-- AlterTable
ALTER TABLE "StaffAssignment" ADD COLUMN     "teamId" TEXT;

-- CreateIndex
CREATE INDEX "StaffAssignment_teamId_idx" ON "StaffAssignment"("teamId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAssignment" ADD CONSTRAINT "StaffAssignment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
