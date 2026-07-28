-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('emergency', 'ward', 'lab', 'radiology', 'surgery', 'operating_room', 'icu', 'outpatient', 'pharmacy', 'administration', 'rehabilitation', 'other');

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "type" "UnitType" NOT NULL DEFAULT 'other';
