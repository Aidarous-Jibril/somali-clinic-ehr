import { EncounterType } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const findOpenEncounter = ( patientId: string ) => {
  return prisma.encounter.findFirst({
    where: {
      patientId,
      status: "open",
    },
  });
};

export const createEncounter = (data: {
  clinicId: string;
  patientId: string;
  type: EncounterType;
  reason?: string;
  notes?: string;
}) => {
  return prisma.encounter.create({
    data,
  });
};

export const listEncountersByPatient = (
  patientId: string
) => {
  return prisma.encounter.findMany({
    where: {
      patientId,
    },
    orderBy: {
      startedAt: "desc",
    },
  });
};

export const closeEncounter = (
  encounterId: string
) => {
  return prisma.encounter.update({
    where: {
      id: encounterId,
    },
    data: {
      status: "closed",
      endedAt: new Date(),
    },
  });
};