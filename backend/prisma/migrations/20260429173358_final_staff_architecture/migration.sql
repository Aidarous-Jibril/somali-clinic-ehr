/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `prescribedByStaffId` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `sentByStaffId` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the column `administeredByStaffId` on the `Vaccination` table. All the data in the column will be lost.
  - You are about to drop the column `orderedByStaffId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `resultedByStaffId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedByStaffId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `doctorAssignmentId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prescribedByAccountId` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderedByAccountId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_prescribedByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_sentByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_unitId_fkey";

-- DropForeignKey
ALTER TABLE "Vaccination" DROP CONSTRAINT "Vaccination_administeredByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_orderedByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_resultedByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_reviewedByStaffId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_staffId_fkey";

-- DropIndex
DROP INDEX "Appointment_doctorId_scheduledAt_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "doctorId",
ADD COLUMN     "doctorAssignmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "prescribedByStaffId",
ADD COLUMN     "prescribedByAccountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "sentByStaffId",
ADD COLUMN     "sentByAccountId" TEXT;

-- AlterTable
ALTER TABLE "Vaccination" DROP COLUMN "administeredByStaffId",
ADD COLUMN     "administeredByAccountId" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "orderedByStaffId",
DROP COLUMN "resultedByStaffId",
DROP COLUMN "reviewedByStaffId",
DROP COLUMN "staffId",
ADD COLUMN     "orderedByAccountId" TEXT NOT NULL,
ADD COLUMN     "resultedByAccountId" TEXT,
ADD COLUMN     "reviewedByAccountId" TEXT;

-- DropTable
DROP TABLE "Staff";

-- CreateTable
CREATE TABLE "StaffPerson" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "nationalId" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffAccount" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffAssignment" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "unitId" TEXT,
    "role" "ReferralRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffPerson_licenseNumber_key" ON "StaffPerson"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StaffAccount_clinicId_email_key" ON "StaffAccount"("clinicId", "email");

-- CreateIndex
CREATE INDEX "Appointment_doctorAssignmentId_scheduledAt_idx" ON "Appointment"("doctorAssignmentId", "scheduledAt");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_orderedByAccountId_fkey" FOREIGN KEY ("orderedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_resultedByAccountId_fkey" FOREIGN KEY ("resultedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_reviewedByAccountId_fkey" FOREIGN KEY ("reviewedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_prescribedByAccountId_fkey" FOREIGN KEY ("prescribedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_sentByAccountId_fkey" FOREIGN KEY ("sentByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_administeredByAccountId_fkey" FOREIGN KEY ("administeredByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAccount" ADD CONSTRAINT "StaffAccount_personId_fkey" FOREIGN KEY ("personId") REFERENCES "StaffPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAccount" ADD CONSTRAINT "StaffAccount_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAssignment" ADD CONSTRAINT "StaffAssignment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "StaffAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAssignment" ADD CONSTRAINT "StaffAssignment_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorAssignmentId_fkey" FOREIGN KEY ("doctorAssignmentId") REFERENCES "StaffAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
