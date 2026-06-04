-- CreateEnum
CREATE TYPE "JournalNoteStatus" AS ENUM ('draft', 'signed', 'voided');

-- CreateEnum
CREATE TYPE "JournalTableStatus" AS ENUM ('open', 'closed');

-- CreateTable
CREATE TABLE "JournalTable" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "encounterId" TEXT,
    "title" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "JournalTableStatus" NOT NULL DEFAULT 'open',
    "closeReason" TEXT,
    "closeComment" TEXT,
    "closedAt" TIMESTAMP(3),
    "closedByStaffId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalNote" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "encounterId" TEXT,
    "templateId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sectionValues" JSONB,
    "status" "JournalNoteStatus" NOT NULL DEFAULT 'draft',
    "authorId" TEXT,
    "authorName" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "eventDateTime" TIMESTAMP(3) NOT NULL,
    "signedAt" TIMESTAMP(3),
    "voidedAt" TIMESTAMP(3),
    "voidReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JournalTable" ADD CONSTRAINT "JournalTable_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalTable" ADD CONSTRAINT "JournalTable_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalTable" ADD CONSTRAINT "JournalTable_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalNote" ADD CONSTRAINT "JournalNote_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "JournalTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
