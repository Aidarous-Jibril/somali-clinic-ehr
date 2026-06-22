import { Gender } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

/* ---------------------------------- */
/* MRN Counter                        */
/* ---------------------------------- */
export const incrementClinicMrn = (clinicId: string) => {
  return prisma.clinic.update({
    where: { id: clinicId },
    data: {
      mrnCounter: { increment: 1 },
    },
  });
};

/* ---------------------------------- */
/* Create Patient                     */
/* ---------------------------------- */
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

/* ---------------------------------- */
/* Duplicate Match In Same Clinic     */
/* ---------------------------------- */
export const findDuplicatePatient = (params: {
  clinicId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phone?: string;
  nationalId?: string;
}) => {
  const {
    clinicId,
    firstName,
    lastName,
    dateOfBirth,
    phone,
    nationalId,
  } = params;

  return prisma.patient.findFirst({
    where: {
      clinicId,
      isDeleted: false,
      OR: [
        nationalId ? { nationalId } : undefined,
        {
          firstName: {
            equals: firstName,
            mode: "insensitive",
          },
          lastName: {
            equals: lastName,
            mode: "insensitive",
          },
          dateOfBirth,
        },
        phone ? { phone } : undefined,
      ].filter(Boolean) as any,
    },
  });
};

/* ---------------------------------- */
/* Find By Id                         */
/* ---------------------------------- */
export const findPatientById = (patientId: string) => {
  return prisma.patient.findFirst({
    where: {
      id: patientId,
      isDeleted: false,
    },
    include: {
      clinic: true,
    },
  });
};

/* ---------------------------------- */
/* List All (SuperAdmin)              */
/* ---------------------------------- */
export const findAllPatients = () => {
  return prisma.patient.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ---------------------------------- */
/* List By Clinic                     */
/* ---------------------------------- */
export const findPatientsByClinic = (clinicId: string) => {
  return prisma.patient.findMany({
    where: {
      clinicId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ---------------------------------- */
/* Search                             */
/* ---------------------------------- */
export const searchPatients = (
  q: string,
  clinicId?: string
) => {
  return prisma.patient.findMany({
    where: {
      ...(clinicId && { clinicId }),
      isDeleted: false,
      OR: [
        { mrn: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ],
    },
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ---------------------------------- */
/* Update Patient                     */
/* ---------------------------------- */
export const updatePatient = (
  patientId: string,
  data: Partial<{
    firstName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: Date;
    phone?: string;
    email?: string;
    nationalId?: string;
  }>
) => {
  return prisma.patient.update({
    where: {
      id: patientId,
    },
    data,
  });
};

/* ---------------------------------- */
/* Soft Delete                        */
/* ---------------------------------- */
export const softDeletePatient = (
  patientId: string
) => {
  return prisma.patient.update({
    where: {
      id: patientId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};