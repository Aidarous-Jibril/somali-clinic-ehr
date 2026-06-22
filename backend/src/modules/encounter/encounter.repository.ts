import { EncounterType } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const findOpenEncounter = ( patientId: string, clinicId?: string ) => {
  return prisma.encounter.findFirst({
    where: {
      patientId,
      status: "open",
      ...(clinicId && { clinicId }),
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

export const listEncountersByPatient = ( patientId?: string, clinicId?: string) => {
  return prisma.encounter.findMany({
    where: {
      patientId,
      ...(clinicId && { clinicId }),
    },
    orderBy: {
      startedAt: "desc",
    },
  });
};

export const closeEncounter = ( encounterId: string ) => {
  return prisma.encounter.update({
    where: { id: encounterId, },
    data: {
      status: "closed",
      endedAt: new Date(),
    },
  });
};

export const findEncounterById = ( encounterId: string, clinicId?: string ) => {
  return prisma.encounter.findFirst({
    where: {
      id: encounterId,
      ...(clinicId && { clinicId }),
    },
  });
};

  export const findPatientById = (id: string) =>
  prisma.patient.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });