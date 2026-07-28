/*
  Warnings:

  - A unique constraint covering the columns `[unitId,name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Team_clinicId_idx" ON "Team"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_unitId_name_key" ON "Team"("unitId", "name");
