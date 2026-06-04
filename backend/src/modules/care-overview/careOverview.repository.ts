import { prisma } from "../../config/prisma.js";

export const findPatientEncounters = ( patientId: string ) =>
  prisma.encounter.findMany({
    where: {
      patientId,
    },

    include: {
      clinic: true,
    },

    orderBy: {
      startedAt: "desc",
    },
  });