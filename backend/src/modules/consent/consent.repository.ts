import { prisma } from "../../config/prisma.js";
import { ConsentStatus } from "@prisma/client";

const toDbStatus = ( status: string ): ConsentStatus => {
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
      return ConsentStatus.active;
  }
};

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
      organizationLine: data.organizationLine,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: toDbStatus(data.status),
      createdByStaffId: data.createdByStaffId,
    },
  });

export const updateConsentStatus = ( id: string, status: string ) =>
  prisma.consent.update({
    where: {
      id,
    },
    data: {
      status: toDbStatus(status),
    },
  });