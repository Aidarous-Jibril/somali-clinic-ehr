import * as repo from "./order.repository.js";
import { CreateOrderInput } from "./order.schema.js";
import { OrderCategory } from "@prisma/client";

export const createOrder = async (input: CreateOrderInput) => {
  return repo.createOrder({
    clinicId: input.clinicId,
    patientId: input.patientId,
    encounterId: input.encounterId,
    category: input.category as OrderCategory,
    code: input.code,
    name: input.name,
    orderedBy: input.orderedBy,
  });
};

export const listOrdersByEncounter = (encounterId: string) => {
  return repo.findOrdersByEncounter(encounterId);
};

export const listOrdersByPatient = (patientId: string) => {
  return repo.findOrdersByPatient(patientId);
};
