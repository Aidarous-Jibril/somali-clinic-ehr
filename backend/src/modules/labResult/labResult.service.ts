import * as repo from "./labResult.repository.js";
import { CreateLabResultInput } from "./labResult.schema.js";
import { LabResultFlag } from "@prisma/client";

export const createLabResult = async (input: CreateLabResultInput) => {
  return repo.createLabResult({
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
};

export const listResultsByPatient = (patientId: string) => {
  return repo.findResultsByPatient(patientId);
};
