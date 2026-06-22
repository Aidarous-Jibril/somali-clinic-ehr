import * as repo from "./order.repository.js";
import { OrderCategory } from "@prisma/client";
import * as samplingRepo from "../sampling/sampling.repository.js";
import { prisma } from "../../config/prisma.js";
import * as labResultRepo from "../labResult/labResult.repository.js";

export const createOrder = async (input: any) => {
  const encounter = await prisma.encounter.findFirst({
    where: {
      id: input.encounterId,
      clinicId: input.clinicId,
    },
  });

  if (!encounter) throw new Error("Encounter not found");

  const patient = await prisma.patient.findFirst({
    where: {
      id: input.patientId,
      clinicId: input.clinicId,
    },
  });

  if (!patient) throw new Error("Patient not found");

  if (input.performerUnitId) {
    const unit = await prisma.unit.findFirst({
      where: {
        id: input.performerUnitId,
        clinicId: input.clinicId,
      },
    });

    if (!unit) throw new Error("Unit not found");
  }

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

  // auto sample creation
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

export const listOrdersByPatient = async ( patientId: string, clinicId: string ) => {
  const patient = await repo.findPatientById( patientId, clinicId);

  if (!patient)
    throw new Error("Patient not found");

  return repo.findOrdersByPatient(patientId);
};

export const listLabOrders = (clinicId: string) => {
  return repo.findLabOrders(clinicId);
};

// ordered → in_progress
export const startOrder = (id: string) =>
  repo.updateOrder(id, { status: "in_progress",});

// in_progress → resulted
export const resultOrder = async (
  id: string,
  clinicId: string,
  accountId: string,
  input: {
    value: string;
    unit?: string;
    flag: "normal" | "high" | "low" | "critical";
    comment?: string;
  }
) => {
  // 1. find order
  const order = await repo.findOrderById(id);

  if (!order)
    throw new Error("Order not found");

  // clinic isolation
  if (order.clinicId !== clinicId) 
    throw new Error("Forbidden: different clinic");

  // workflow validation
  if (order.status !== "in_progress")
    throw new Error("Order must be in progress first");

  // 2. find sample
  const sample = await samplingRepo.findSampleByOrderId(id);

  if (!sample) 
    throw new Error("Sample not found");

  // 3. validate sample status
  if (sample.status !== "completed") 
    throw new Error( "Cannot result order before sample completion" );
  
  // 4. prevent duplicate results
  const existingResult = await labResultRepo.findResultByOrderId(id);

  if (existingResult) 
    throw new Error(  "Lab result already exists for this order" );
  

  // 5. transaction
  return prisma.$transaction(async (tx) => {
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

// resulted → reviewed
export const reviewOrder = (id: string, accountId: string) =>
  repo.updateOrder(id, {
    status: "reviewed",
    reviewedAt: new Date(),
    reviewedByAccountId: accountId,
  });

// reviewed → completed
export const completeOrder = (id: string) =>
  repo.updateOrder(id, {
    status: "completed",
    completedAt: new Date(),
  });