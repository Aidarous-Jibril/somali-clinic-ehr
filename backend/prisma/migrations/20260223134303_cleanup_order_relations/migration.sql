/*
  Warnings:

  - You are about to drop the column `acceptedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedByStaffId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `collectedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `collectedByStaffId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_acceptedByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_collectedByStaffId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "acceptedAt",
DROP COLUMN "acceptedByStaffId",
DROP COLUMN "collectedAt",
DROP COLUMN "collectedByStaffId",
DROP COLUMN "scheduledAt",
ADD COLUMN     "staffId" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
