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

export const findResultsByPatient = (patientId: string, clinicId: string) => {
  return prisma.labResult.findMany({
    where: { patientId, clinicId },
   include: {
      order: {
        select: {
          id: true,
          status: true,
          category: true,
          name: true,
        },
      },
    },
    orderBy: { resultDate: "desc" },
  });
};

export const findResultByOrderId = ( orderId: string ) => {
  return prisma.labResult.findFirst({
    where: {
      orderId,
    },
  });
};