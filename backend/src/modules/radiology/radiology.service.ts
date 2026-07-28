//radiology.service.ts
import { prisma } from "../../config/prisma.js";
import * as repo from "./radiology.repository.js";


export const submitRadiologyReportService = async (input: {
  orderId: string;
  clinicId: string;
  accountId: string;
  impression: string;
  findings?: string;
  overallResult: "normal" | "high" | "low" | "critical";
  comment?: string;

  files: Express.Multer.File[];
}) => {
  const order = await repo.findOrderById(input.orderId);

  if (!order)
    throw new Error("Order not found");

  if (order.clinicId !== input.clinicId)
    throw new Error("Forbidden");

  if (order.category !== "radiology")
    throw new Error("Not a radiology order");

  if (order.status !== "awaiting_result")
    throw new Error("Order must be awaiting_result");

  return repo.createRadiologyReport(input);
};



export const listRadiologyResultsByPatientService = ( patientId: string, clinicId: string ) => {
  return repo.findRadiologyResultsByPatient( patientId, clinicId );
};