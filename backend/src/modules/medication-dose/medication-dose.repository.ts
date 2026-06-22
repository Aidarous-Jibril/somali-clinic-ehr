import {
  MedicationAdministrationAction,
  MedicationDoseStatus,
} from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export const createDose = (data: {
  medicationId: string;
  scheduledDate: Date;
  label: string;
  tooltip?: string;
  isPrn?: boolean;
}) => {
  return prisma.medicationDose.create({
    data: {
      medicationId: data.medicationId,
      scheduledDate: data.scheduledDate,
      label: data.label,
      tooltip: data.tooltip,
      isPrn: data.isPrn ?? false,
    },
  });
};

export const findMedicationById = ( medicationId: string ) => {
  return prisma.medication.findUnique({
    where: { id: medicationId,},
  });
};

export const findDoseById = (id: string) => {
  return prisma.medicationDose.findUnique({
    where: { id },

    include: {
      medication: true,
    },
  });
};

export const findDoseWithMedication = (
  doseId: string
) => {
  return prisma.medicationDose.findUnique({
    where: {
      id: doseId,
    },

    include: {
      medication: true,
    },
  });
};

export const getDosesByMedication = (
  medicationId: string
) => {
  return prisma.medicationDose.findMany({
    where: {
      medicationId,
    },

    orderBy: {
      scheduledDate: "asc",
    },
  });
};

export const updateDoseStatus = (
  doseId: string,
  status: MedicationDoseStatus
) => {
  return prisma.medicationDose.update({
    where: { id: doseId },

    data: {
      status,
    },
  });
};

export const createAdministration = (data: {
  medicationId: string;
  doseId?: string;
  action: MedicationAdministrationAction;
  performedByAccountId?: string;
  administeredDose?: string;
  batchNumber?: string;
  comment?: string;
  reason?: string;
}) => {
  return prisma.medicationAdministration.create({
    data,
  });
};

export const getAdministrationsByMedication = (
  medicationId: string
) => {
  return prisma.medicationAdministration.findMany({
    where: {
      medicationId,
    },

    orderBy: {
      performedAt: "desc",
    },

    include: {
      dose: {
        select: {
          id: true,
          label: true,
        },
      },

      performedByAccount: {
        include: {
          person: true,
        },
      },
    },
  });
};