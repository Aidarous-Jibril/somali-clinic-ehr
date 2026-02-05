import { prisma } from "../../config/prisma.js";
import { LabResultFlag } from "@prisma/client";

export const createLabResult = (data: {
  clinicId: string;
  patientId: string;
  orderId: string;
  value: string;
  unit?: string;
  flag: LabResultFlag;
  resultDate?: Date;
}) => {
  return prisma.labResult.create({ data });
};

export const findResultsByPatient = (patientId: string) => {
  return prisma.labResult.findMany({
    where: { patientId },
    include: {
      order: true,
    },
    orderBy: { resultDate: "desc" },
  });
};
