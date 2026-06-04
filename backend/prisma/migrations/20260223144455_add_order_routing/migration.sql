-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "performerUnitId" TEXT,
ADD COLUMN     "plannedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_performerUnitId_fkey" FOREIGN KEY ("performerUnitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
