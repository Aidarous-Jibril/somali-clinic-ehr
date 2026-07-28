//modules/dashboard/radiology/radiology.respoiroty.ts
import { prisma } from "../../../config/prisma.js";

export const getRadiologyWorklist = (clinicId: string) => {
  return prisma.order.findMany({
    where: {
      clinicId,
      category: "radiology",
    },

    include: {
      patient: true,

      clinic: true,

      performerUnit: true,

      orderedByAccount: {
        include: {
          person: true,
        },
      },

      resultedByAccount: {
        include: {
          person: true,
        },
      },

      reviewedByAccount: {
        include: {
          person: true,
        },
      },

      radiologyReport: {
        include: {
          images: true,
        },
      },
    },

    orderBy: {
      orderedAt: "desc",
    },
  });
};