/*
  Warnings:

  - Added the required column `clinicId` to the `FluidBalanceEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FluidBalanceEntry" ADD COLUMN     "clinicId" TEXT NOT NULL;
