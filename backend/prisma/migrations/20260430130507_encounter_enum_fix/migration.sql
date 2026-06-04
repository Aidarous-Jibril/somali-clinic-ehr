/*
  Warnings:

  - The `status` column on the `Encounter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Encounter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Encounter" DROP COLUMN "type",
ADD COLUMN     "type" "EncounterType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EncounterStatus" NOT NULL DEFAULT 'open';
