import { prisma } from "../../config/prisma.js";
import { ConsentStatus } from "@prisma/client";

const toDbStatus = (
  status: string
): ConsentStatus => {
  switch (status.toLowerCase()) {
    case "active":
      return ConsentStatus.active;

    case "ended":
      return ConsentStatus.ended;

    case "upcoming":
      return ConsentStatus.upcoming;

    case "cancelled":
      return ConsentStatus.cancelled;

    default:
      // return ConsentStatus.active;
      throw new Error("Invalid consent status");
  }
};

export const findPatientById = ( patientId: string ) =>
  prisma.patient.findFirst({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });

export const findConsentById = (id: string, clinicId?: string ) =>
  prisma.consent.findFirst({
    where: {
      id,
      ...(clinicId && { clinicId }),
    },
  });

export const getConsentsByPatient = ( patientId: string ) =>
  prisma.consent.findMany({
    where: {
      patientId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

export const createConsent = (data: {
  clinicId: string;
  patientId: string;
  type: string;
  title: string;
  organizationLine: string;
  startDate: string;
  endDate: string;
  status: string;
  createdByStaffId?: string;
}) =>
  prisma.consent.create({
    data: {
      clinicId: data.clinicId,
      patientId: data.patientId,
      type: data.type,
      title: data.title,
      organizationLine:
        data.organizationLine,
      startDate: new Date(
        data.startDate
      ),
      endDate: new Date(data.endDate),
      status: toDbStatus(data.status),
      createdByStaffId:
        data.createdByStaffId,
    },
  });

export const updateConsentStatus = ( id: string, status: string ) =>
  prisma.consent.update({
    where: { id, },
    data: { status: toDbStatus(status), },
  });

  export const findActiveConsent = ( patientId: string, type: string ) =>
  prisma.consent.findFirst({
    where: {
      patientId,
      type,
      status: "active",
    },
  });


export const remove = async (id: string) => {
  return prisma.consent.delete({
    where: { id },
  });
};