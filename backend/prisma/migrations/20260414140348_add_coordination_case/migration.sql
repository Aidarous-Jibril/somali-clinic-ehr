-- CreateTable
CREATE TABLE "CoordinationCase" (
    "id" TEXT NOT NULL,
    "stayId" TEXT NOT NULL,
    "infoSharingConsent" TEXT NOT NULL,
    "coordinationNeeded" TEXT NOT NULL,
    "sipConsent" TEXT NOT NULL,
    "adminComment" TEXT,
    "recipients" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoordinationCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoordinationCase_stayId_key" ON "CoordinationCase"("stayId");

-- AddForeignKey
ALTER TABLE "CoordinationCase" ADD CONSTRAINT "CoordinationCase_stayId_fkey" FOREIGN KEY ("stayId") REFERENCES "InpatientStay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
