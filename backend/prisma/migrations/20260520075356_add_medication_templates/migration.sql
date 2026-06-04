-- CreateTable
CREATE TABLE "MedicationTemplate" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "treatmentReason" TEXT,
    "templateName" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "form" TEXT,
    "strength" TEXT,
    "dosing" TEXT,
    "name" TEXT,
    "dose" TEXT,
    "frequency" "MedicationFrequency" NOT NULL DEFAULT 'once_daily',
    "groupType" "MedicationGroupType" NOT NULL DEFAULT 'current',
    "dosingText" TEXT,
    "indication" TEXT,
    "strengthValue" TEXT,
    "formValue" TEXT,
    "route" "MedicationRoute",
    "notes" TEXT,
    "recommended" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicationTemplate_clinicId_idx" ON "MedicationTemplate"("clinicId");
