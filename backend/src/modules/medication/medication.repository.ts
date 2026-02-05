import { prisma } from "../../config/prisma.js";
import { MedicationStatus } from "@prisma/client";

export const createMedication = (data: {
  clinicId: string;
  patientId: string;
  encounterId?: string;
  name: string;
  strength?: string;
  dose: string;
  frequency: any;
}) => {
  return prisma.medication.create({ data });
};

export const findActiveByPatient = (patientId: string) => {
  return prisma.medication.findMany({
    where: {
      patientId,
      status: MedicationStatus.active,
    },
    orderBy: { startDate: "desc" },
  });
};

export const updateStatus = (
  medicationId: string,
  status: MedicationStatus
) => {
  return prisma.medication.update({
    where: { id: medicationId },
    data: {
      status,
      endDate: status === "ended" ? new Date() : null,
    },
  });
};
