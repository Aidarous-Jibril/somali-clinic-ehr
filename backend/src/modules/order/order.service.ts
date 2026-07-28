import * as repo from "./order.repository.js";
import { OrderCategory, UnitType } from "@prisma/client";
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


export const startOrder = async (id: string) => {
  const order = await repo.findOrderById(id);

  if (!order)
    throw new Error("Order not found");

  if (order.category === "radiology") {

    return repo.updateOrder(id, {
      status: "awaiting_result",
    });
  }

  return repo.updateOrder(id, {
    status: "in_progress",
  });
};
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
  // 1. Find order
  const order = await repo.findOrderById(id);

  if (!order)
    throw new Error("Order not found");

  // 2. Clinic isolation
  if (order.clinicId !== clinicId)
    throw new Error("Forbidden: different clinic");

  // 3. Workflow validation
  if (order.status !== "awaiting_result")
    throw new Error("Order must be awaiting result first");

  // 4. Route to the correct workflow
  switch (order.category) {
    case "chemistry":
    case "microbiology":
      return resultLaboratoryOrder(
        order,
        accountId,
        input
      );

    case "radiology":
      return resultRadiologyOrder(
        order,
        accountId,
        input
      );

    default:
      throw new Error(
        `Unsupported order category: ${order.category}`
      );
  }
};


export const resultLaboratoryOrder = async (
  order: any,
  accountId: string,
  input: {
    value: string;
    unit?: string;
    flag: "normal" | "high" | "low" | "critical";
    comment?: string;
  }
) => {
  // Sample must exist
  const sample = await samplingRepo.findSampleByOrderId(order.id);

  if (!sample)
    throw new Error("Sample not found");

  // Sample must be completed
  if (sample.status !== "completed")
    throw new Error( "Cannot result order before sample completion" );

  // Duplicate prevention
  const existingResult =
    await labResultRepo.findResultByOrderId(order.id);

  if (existingResult)
    throw new Error("Lab result already exists for this order");

  // Save result
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
      where: { id: order.id },
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

export const resultRadiologyOrder = async (
  order: any,
  accountId: string,
  input: {
    value: string;
    unit?: string;
    flag: "normal" | "high" | "low" | "critical";
    comment?: string;
  }
) => {
  
  // Prevent duplicate reports
  const existingResult =
    await labResultRepo.findResultByOrderId(order.id);

  if (existingResult) 
    throw new Error("Radiology report already exists");

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
      where: { id: order.id },
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

export const listPerformerUnits = async ( clinicId: string, category: OrderCategory ) => {
  switch (category) {
    case "chemistry":
    case "microbiology":
      return repo.findPerformerUnits(clinicId, UnitType.lab);

    case "radiology":
      return repo.findPerformerUnits(clinicId, UnitType.radiology);

    case "procedure":
      return repo.findPerformerUnits(clinicId, UnitType.operating_room);

    default:
      return [];
  }
};