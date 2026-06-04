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

  // Additional fields
  form?: string;
  groupType?: any;
  dosingText?: string;
  indication?: string;
  route?: any;
  notes?: string;

  prescribedByAccountId: string;
}) => {
  return prisma.medication.create({
    data: {
      clinicId: data.clinicId,
      patientId: data.patientId,
      encounterId: data.encounterId,

      name: data.name,
      strength: data.strength,
      dose: data.dose,
      frequency: data.frequency,

      form: data.form,
      groupType: data.groupType,
      dosingText: data.dosingText,
      indication: data.indication,
      route: data.route,
      notes: data.notes,

      prescribedByAccountId: data.prescribedByAccountId,
    },
  });
};

export const findMedicationsByPatient = ( patientId: string, clinicId: string ) => {
  return prisma.medication.findMany({
    where: {
      patientId,
      clinicId,
    },

    orderBy: {
      startDate: "desc",
    },

    include: {
      prescribedByAccount: {
        include: {
          person: true,
        },
      },

      scheduledDoses: {
        orderBy: {
          scheduledDate: "asc",
        },
      },
    },
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

export const findFavorites = () => {
  return prisma.medicationTemplate.findMany({
    where: {
      recommended: true,
    },
    orderBy: {
      templateName: "asc",
    },
    take: 50,
  });
};