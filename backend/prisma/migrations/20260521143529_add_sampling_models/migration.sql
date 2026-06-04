-- CreateEnum
CREATE TYPE "SampleType" AS ENUM ('blood', 'urine', 'stool', 'saliva', 'tissue', 'swab', 'serum', 'plasma', 'csf', 'biopsy', 'other');

-- CreateEnum
CREATE TYPE "SampleStatus" AS ENUM ('registered', 'collected', 'in_transit', 'received', 'processing', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "SampleTrackingEventType" AS ENUM ('registered', 'collected', 'transferred', 'received', 'processing', 'completed', 'rejected');

-- CreateTable
CREATE TABLE "Sample" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "sampleType" "SampleType" NOT NULL,
    "status" "SampleStatus" NOT NULL DEFAULT 'registered',
    "barcode" TEXT,
    "collectedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "collectedByAccountId" TEXT,
    "processedByAccountId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleTrackingEvent" (
    "id" TEXT NOT NULL,
    "sampleId" TEXT NOT NULL,
    "type" "SampleTrackingEventType" NOT NULL,
    "performedByAccountId" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SampleTrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sample_barcode_key" ON "Sample"("barcode");

-- CreateIndex
CREATE INDEX "Sample_orderId_idx" ON "Sample"("orderId");

-- CreateIndex
CREATE INDEX "Sample_patientId_idx" ON "Sample"("patientId");

-- CreateIndex
CREATE INDEX "Sample_status_idx" ON "Sample"("status");

-- CreateIndex
CREATE INDEX "SampleTrackingEvent_sampleId_idx" ON "SampleTrackingEvent"("sampleId");

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_collectedByAccountId_fkey" FOREIGN KEY ("collectedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_processedByAccountId_fkey" FOREIGN KEY ("processedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleTrackingEvent" ADD CONSTRAINT "SampleTrackingEvent_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleTrackingEvent" ADD CONSTRAINT "SampleTrackingEvent_performedByAccountId_fkey" FOREIGN KEY ("performedByAccountId") REFERENCES "StaffAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
