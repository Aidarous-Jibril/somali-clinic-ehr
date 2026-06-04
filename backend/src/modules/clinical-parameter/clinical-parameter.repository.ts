import { prisma } from "../../config/prisma.js";

export const createEntry = (data: {
  encounterId: string;
  name: any;
  value: string;
  note?: string;
  recordedByAccountId?: string;
}) => {
  return prisma.clinicalParameterEntry .create({ data });
};

export const listByEncounter = (encounterId: string) => {
  return prisma.clinicalParameterEntry.findMany({
    where: { encounterId },
    orderBy: { recordedAt: "desc" },

    include: {
      recordedByAccount: {
        include: {
          person: true,
        },
      },
    },
  });
};