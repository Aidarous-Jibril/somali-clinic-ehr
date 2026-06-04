import { prisma } from "../../config/prisma.js";
import { OrderCategory, OrderStatus } from "@prisma/client";

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
        include: {
          person: true,
        },
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
      orderedByAccount: {
        include: { person: true },
      },
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

// order.repository.ts
export const findLabOrders = (clinicId: string) => {
  return prisma.order.findMany({
    where: {
      clinicId,

      category: {
        in: ["chemistry", "microbiology"],
      },

      status: {
        in: ["ordered", "in_progress",  "awaiting_result",],
      },
    },

    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },

      samples: {
        select: {
          id: true,
          status: true,
          sampleType: true,
          barcode: true,
        },
      },
    },

    orderBy: {
      orderedAt: "asc",
    },
  });
};