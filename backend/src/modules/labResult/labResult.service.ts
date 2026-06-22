import { prisma } from "../../config/prisma.js";
import * as repo from "./labResult.repository.js";
import { CreateLabResultInput } from "./labResult.schema.js";
import { LabResultFlag } from "@prisma/client";

export const createLabResult = async ( input: CreateLabResultInput, currentUser: any ) => {
  // 1. find order
  const order = await repo.findOrderById(input.orderId);

  if (!order)
    throw new Error("Order not found");

  // 2. validate patient ownership
  if (order.patientId !== input.patientId)
    throw new Error("Order does not belong to patient");

  // 3. clinic isolation
  if (order.clinicId !== currentUser.clinicId)
    throw new Error("Forbidden");

  // 4. workflow validation
  if (order.status !== "in_progress")
    throw new Error("Order must be in progress first");

  // 5. duplicate prevention
  const existingResult = await repo.findResultByOrderId(
    input.orderId
  );

  if (existingResult)
    throw new Error(
      "Lab result already exists for this order"
    );

  // 6. atomic transaction
  return prisma.$transaction(async (tx) => {
    const result = await tx.labResult.create({
      data: {
        clinicId: currentUser.clinicId,
        patientId: input.patientId,
        orderId: input.orderId,
        value: input.value,
        unit: input.unit,
        flag: input.flag as LabResultFlag,
        resultDate: input.resultDate || new Date(),
      },
    });

    await tx.order.update({
      where: { id: input.orderId },
      data: {
        status: "resulted",
        resultedAt: new Date(),
      },
    });

    return result;
  });
};

export const listResultsByPatient = ( patientId: string, clinicId: string ) => {
  return repo.findResultsByPatient( patientId, clinicId );
};