-- CreateTable
CREATE TABLE "NutritionPrescription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "description" TEXT,
    "articleNo" TEXT,
    "productArea" TEXT,
    "prescribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "prescriber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'valid',

    CONSTRAINT "NutritionPrescription_pkey" PRIMARY KEY ("id")
);
