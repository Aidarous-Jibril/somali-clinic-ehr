// fluidBalance.repository.ts
import { prisma } from "../../config/prisma.js";

export const createFluidBalance = (data: {
  clinicId: string;
  patientId: string;
  encounterId?: string;
  measuredAt: Date;
  label: string;
  period: string;
  intakeMl: number;
  outputMl: number;
  balanceMl: number;
  details: {
    oralMl: number;
    oralKcal: number;
    enteralMl: number;
    enteralKcal: number;
    urineMl: number;
    bleedingMl: number;
    faecesMl: number;
    vomitingMl: number;
  };
}) => {
  return prisma.fluidBalanceEntry.create({
    data: {
      clinicId: data.clinicId,
      patientId: data.patientId,
      encounterId: data.encounterId,
      measuredAt: data.measuredAt,
      label: data.label,
      period: data.period,
      intakeMl: data.intakeMl,
      outputMl: data.outputMl,
      balanceMl: data.balanceMl,
      details: {
        create: data.details,
      },
    },
    include: { details: true },
  });
};

export const findByPatient = (patientId: string, clinicId: string) => {
  return prisma.fluidBalanceEntry.findMany({
    where: {
      patientId,
      clinicId, 
    },
    orderBy: { measuredAt: "desc" },
    include: { details: true },
  });
};
