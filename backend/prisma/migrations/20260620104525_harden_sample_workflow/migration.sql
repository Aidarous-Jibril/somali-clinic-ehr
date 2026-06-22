/*
  Warnings:

  - The values [in_transit] on the enum `SampleStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [transferred] on the enum `SampleTrackingEventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SampleStatus_new" AS ENUM ('registered', 'collected', 'received', 'processing', 'completed', 'rejected');
ALTER TABLE "public"."Sample" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Sample" ALTER COLUMN "status" TYPE "SampleStatus_new" USING ("status"::text::"SampleStatus_new");
ALTER TYPE "SampleStatus" RENAME TO "SampleStatus_old";
ALTER TYPE "SampleStatus_new" RENAME TO "SampleStatus";
DROP TYPE "public"."SampleStatus_old";
ALTER TABLE "Sample" ALTER COLUMN "status" SET DEFAULT 'registered';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SampleTrackingEventType_new" AS ENUM ('registered', 'collected', 'received', 'processing', 'completed', 'rejected');
ALTER TABLE "SampleTrackingEvent" ALTER COLUMN "type" TYPE "SampleTrackingEventType_new" USING ("type"::text::"SampleTrackingEventType_new");
ALTER TYPE "SampleTrackingEventType" RENAME TO "SampleTrackingEventType_old";
ALTER TYPE "SampleTrackingEventType_new" RENAME TO "SampleTrackingEventType";
DROP TYPE "public"."SampleTrackingEventType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Sample" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "receivedByAccountId" TEXT;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_receivedByAccountId_fkey" FOREIGN KEY ("receivedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
