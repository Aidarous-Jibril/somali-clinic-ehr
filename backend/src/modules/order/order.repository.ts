import { prisma } from "../../config/prisma.js";
import { OrderCategory, OrderStatus } from "@prisma/client";

export const createOrder = (data: {
  clinicId: string;
  patientId: string;
  encounterId: string;
  category: OrderCategory;
  code: string;
  name: string;
  orderedBy: string;
}) => {
  return prisma.order.create({ data });
};

export const findOrdersByEncounter = (encounterId: string) => {
  return prisma.order.findMany({
    where: { encounterId },
    orderBy: { orderedAt: "desc" },
  });
};

export const findOrdersByPatient = (patientId: string) => {
  return prisma.order.findMany({
    where: { patientId },
    orderBy: { orderedAt: "desc" },
  });
};

