import { prisma } from "../../config/prisma.js";
import * as repo from "./labResult.repository.js";
import { CreateLabResultInput } from "./labResult.schema.js";
import { LabResultFlag } from "@prisma/client";

export const createLabResult = async ( input: CreateLabResultInput ) => {

  const result = await repo.createLabResult({
    clinicId: input.clinicId,
    patientId: input.patientId,
    orderId: input.orderId,
    value: input.value,
    unit: input.unit,
    flag: input.flag as LabResultFlag,
    resultDate: input.resultDate
      ? new Date(input.resultDate)
      : undefined,
  });

  await prisma.order.update({
    where: {
      id: input.orderId,
    },

    data: {
      status: "resulted",
      resultedAt: new Date(),
    },
  });

  return result;
};
export const listResultsByPatient = (
  patientId: string,
  clinicId: string
) => {
  return repo.findResultsByPatient(
    patientId,
    clinicId
  );
};