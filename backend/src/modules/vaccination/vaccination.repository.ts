import { VaccinationStatus } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const createVaccination = (
  data: {
    clinicId: string;
    patientId: string;
    encounterId?: string;
    vaccineName: string;
    dose?: string;
    manufacturer?: string;
    batchNumber?: string;
    administeredAt?: Date;
    notes?: string;
    status?: VaccinationStatus;
    administeredByAccountId?: string;
  }
) => {
  return prisma.vaccination.create({
    data,
  });
};

export const findByPatient = (
  patientId: string,
  clinicId?: string
) => {
  return prisma.vaccination.findMany({
    where: {
      patientId,
      ...(clinicId && { clinicId }),
    },
    orderBy: {
      administeredAt: "desc",
    },
    include: {
      administeredByAccount: {
        include: {
          person: true,
        },
      },
    },
  });
};

export const findById = (
  id: string,
  clinicId?: string
) => {
  return prisma.vaccination.findFirst({
    where: {
      id,
      ...(clinicId && { clinicId }),
    },
  });
};

export const updateStatus = (
  id: string,
  status: VaccinationStatus
) => {
  return prisma.vaccination.update({
    where: { id },
    data: {
      status,
    },
  });
};

export const completeVaccination = (
  id: string
) => {
  return prisma.vaccination.update({
    where: { id },
    data: {
      status: "completed",
      administeredAt: new Date(),
    },
  });
};

export const findPatientById = (
  id: string
) =>
  prisma.patient.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

export const findEncounterById = (
  id: string
) =>
  prisma.encounter.findUnique({
    where: { id },
  });