import { prisma } from "../../config/prisma.js";
import { ReferralStatus } from "@prisma/client";

export const createReferral = (data: any) => {
  return prisma.referral.create({ data });
};

export const findByPatient = (patientId: string) => {
  return prisma.referral.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateStatus = (id: string, status: ReferralStatus) => {
  return prisma.referral.update({
    where: { id },
    data: { status },
  });
};
