import * as repo from "./order.repository.js";
import { OrderCategory } from "@prisma/client";
import * as samplingRepo from "../sampling/sampling.repository.js";
import { prisma } from "../../config/prisma.js";
import * as labResultRepo from "../labResult/labResult.repository.js";


export const createOrder = async (input: any) => {
  const order = await repo.createOrder({
    clinicId: input.clinicId,
    patientId: input.patientId,
    encounterId: input.encounterId,
    performerUnitId: input.performerUnitId,
    category: input.category as OrderCategory,
    code: input.code,
    name: input.name,
    orderedByAccountId: input.orderedByAccountId,
  });

  // AUTO SAMPLE CREATION
  if (
    order.category === "chemistry" ||
    order.category === "microbiology"
  ) {
    const sample = await samplingRepo.createSample({
      orderId: order.id,
      patientId: order.patientId,
      sampleType: "blood",
      status: "registered",
      barcode: `LAB-${Date.now()}`,
    });

    await samplingRepo.createTrackingEvent({
      sampleId: sample.id,
      type: "registered",
      details: "Sample auto-registered from order",
    });
  }
  return order;
};

export const updateOrder = (id: string, data: any) => {
  return repo.updateOrder(id, data);
};

export const listOrdersByEncounter = (encounterId: string) => {
  return repo.findOrdersByEncounter(encounterId);
};

export const listOrdersByPatient = (patientId: string) => {
  return repo.findOrdersByPatient(patientId);
};

export const listLabOrders = (clinicId: string) => {
  return repo.findLabOrders(clinicId);
};

// LIFECYCLE
export const startOrder = (id: string) =>
  repo.updateOrder(id, {
    status: "in_progress",
  });


export const resultOrder = async (
  id: string,
  accountId: string,
  input: {
    value: string;
    unit?: string;
    flag: "normal" | "high" | "low" | "critical";
    comment?: string;
  }
) => {

  // 1. FIND ORDER
  const order = await repo.findOrderById(id);

  if (!order) {
    throw new Error("Order not found");
  }

  // 2. FIND SAMPLE
  const sample = await samplingRepo.findSampleByOrderId(id);

  if (!sample) {
    throw new Error("Sample not found");
  }

  // 3. VALIDATE SAMPLE STATUS
  if (sample.status !== "completed") {
    throw new Error(
      "Cannot result order before sample completion"
    );
  }

  // 4. PREVENT DUPLICATE RESULTS
  const existingResult = await labResultRepo.findResultByOrderId(id);

  if (existingResult) {
    throw new Error(
      "Lab result already exists for this order"
    );
  }

  // 5. TRANSACTION
  return prisma.$transaction(async (tx) => {

    // CREATE LAB RESULT
    const result = await tx.labResult.create({
      data: {
        clinicId: order.clinicId,
        patientId: order.patientId,
        orderId: order.id,
        value: input.value,
        unit: input.unit,
        flag: input.flag,

        resultDate: new Date(),
      },
    });

    // UPDATE ORDER
    const updatedOrder = await tx.order.update({
      where: { id },

      data: {
        status: "resulted",
        comment: input.comment,
        resultedAt: new Date(),
        resultedByAccountId: accountId,
      },

      include: {
        labResults: true,
      },
    });

    return {
      order: updatedOrder,
      result,
    };
  });
};

export const reviewOrder = (id: string, accountId: string) =>
  repo.updateOrder(id, {
    status: "reviewed",
    reviewedAt: new Date(),
    reviewedByAccountId: accountId, 
  });

export const completeOrder = (id: string) =>
  repo.updateOrder(id, {
    status: "completed",
    completedAt: new Date(),
  });