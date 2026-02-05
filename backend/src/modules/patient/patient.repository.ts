import { Gender } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

/**
 * Atomically increment MRN counter for a clinic
 */
export const incrementClinicMrn = (clinicId: string) => {
  return prisma.clinic.update({
    where: { id: clinicId },
    data: {
      mrnCounter: { increment: 1 },
    },
  });
};

/**
 * Create patient
 */
export const createPatient = (data: {
  clinicId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date;
  phone?: string;
  email?: string;
  nationalId?: string;
}) => {
  return prisma.patient.create({ data });
};

/**
 * List patients by clinic
 */
export const findPatientsByClinic = (clinicId: string) => {
  return prisma.patient.findMany({
    where: { clinicId },
    orderBy: { createdAt: "desc" },
  });
};
