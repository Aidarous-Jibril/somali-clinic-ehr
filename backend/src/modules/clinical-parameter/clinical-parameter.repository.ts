import { prisma } from "../../config/prisma.js";

export const createEntry = (data: {
  encounterId: string;
  name: any;
  value: string;
  note?: string;
  recordedBy?: string;
}) => {
  return prisma.clinicalParameterEntry .create({ data });
};

export const listByEncounter = (encounterId: string) => {
  return prisma.clinicalParameterEntry.findMany({
    where: { encounterId },
    orderBy: { recordedAt: "desc" },
  });
};
