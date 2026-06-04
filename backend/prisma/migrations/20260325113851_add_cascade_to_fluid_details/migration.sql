-- DropForeignKey
ALTER TABLE "FluidBalanceDetails" DROP CONSTRAINT "FluidBalanceDetails_entryId_fkey";

-- AddForeignKey
ALTER TABLE "FluidBalanceDetails" ADD CONSTRAINT "FluidBalanceDetails_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "FluidBalanceEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
