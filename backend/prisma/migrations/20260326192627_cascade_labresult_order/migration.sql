-- DropForeignKey
ALTER TABLE "LabResult" DROP CONSTRAINT "LabResult_orderId_fkey";

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
