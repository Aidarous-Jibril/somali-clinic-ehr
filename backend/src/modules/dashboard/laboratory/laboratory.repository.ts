// modules/dashboard/laboratory/laboratory.repository.ts

import { prisma } from "../../../config/prisma.js";

export const getLaboratoryWorklist = ( clinicId: string, performerUnitId: string ) => {
  return prisma.order.findMany({
    where: {
      clinicId,
      performerUnitId,

      category: {
        in: [ "chemistry", "microbiology", ],
      },
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

      samples: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },

    orderBy: {
      orderedAt: "desc",
    },
  });
};