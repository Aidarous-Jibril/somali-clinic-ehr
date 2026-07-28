import { prisma } from "../../config/prisma.js";
import { OrderCategory, UnitType } from "@prisma/client";

export const createOrder = (data: {
  clinicId: string;
  patientId: string;
  encounterId: string;
  performerUnitId?: string;
  category: OrderCategory;
  code: string;
  name: string;
  orderedByAccountId: string;
}) => {
  return prisma.order.create({
    data,
    include: {
      orderedByAccount: {
        include: {person: true, },
      },

      performerUnit: true,
      clinic: true,
    },
  });
};

export const updateOrder = (id: string, data: any) => {
  return prisma.order.update({
    where: { id },
    data,
    include: {
      orderedByAccount: { include: { person: true }, },
    },
  });
};

export const findOrdersByEncounter = (encounterId: string) => {
  return prisma.order.findMany({
    where: { encounterId },
    orderBy: { orderedAt: "desc" },
     include: {
      orderedByAccount: {
        include: { person: true },
      },
    },
  });
};

export const findOrdersByPatient = (patientId: string) => {
  return prisma.order.findMany({
    where: { patientId },
    orderBy: { orderedAt: "desc" },
    include: {
      orderedByAccount: {
        include: { person: true },
      },
    },
  });
};

export const findOrderById = (id: string) => {
  return prisma.order.findUnique({
    where: { id },

    include: {
      samples: true,
      labResults: true,
    },
  });
};

export const findSampleByOrderId = (orderId: string) => {
  return prisma.sample.findFirst({
    where: { orderId },
    orderBy: { createdAt: "desc" },
  });
};

export const findResultByOrderId = (orderId: string) => {
  return prisma.labResult.findFirst({
    where: { orderId },
  });
};

export const findPatientById = (patientId: string, clinicId: string) => {
  return prisma.patient.findFirst({
    where: {
      id: patientId,
      clinicId,
    },
  });
};

export const findPerformerUnits = ( clinicId: string, type: UnitType ) => {
  return prisma.unit.findMany({
    where: {
      clinicId,
      type,
    },

    select: {
      id: true,
      name: true,
    },

    orderBy: {
      name: "asc",
    },
  });
};