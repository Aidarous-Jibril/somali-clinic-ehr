import { prisma } from "../../config/prisma.js";

export const createSample = (data: any) => {
  return prisma.sample.create({
    data,
    include: {
      order: true,
      patient: true,

      collectedByAccount: {
        include: {
          person: true,
        },
      },

      processedByAccount: {
        include: {
          person: true,
        },
      },

      trackingEvents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const getSampleById = (id: string) => {
  return prisma.sample.findUnique({
    where: { id },

    include: {
      order: true,
      patient: true,

      collectedByAccount: {
        include: {
          person: true,
        },
      },

      processedByAccount: {
        include: {
          person: true,
        },
      },

      trackingEvents: {
        include: {
          performedByAccount: {
            include: {
              person: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const getSamplesByOrderId = (orderId: string) => {
  return prisma.sample.findMany({
    where: { orderId },

    include: {
      trackingEvents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllSamples = (clinicId: string) => {
  return prisma.sample.findMany({
    where: {
      order: {
        clinicId,
      },
    },

    include: {
      patient: true,

      order: {
        include: {
          orderedByAccount: {
            include: {
              person: true,
            },
          },

          performerUnit: true,
          clinic: true,
        },
      },

      collectedByAccount: {
        include: {
          person: true,
        },
      },

      processedByAccount: {
        include: {
          person: true,
        },
      },

      trackingEvents: {
        include: {
          performedByAccount: {
            include: {
              person: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateSample = (id: string, data: any) => {
  return prisma.sample.update({
    where: { id },
    data,
    include: {
      order: true,
      patient: true,
      collectedByAccount: {
        include: {
          person: true,
        },
      },

      processedByAccount: {
        include: {
          person: true,
        },
      },

      trackingEvents: {
        include: {
          performedByAccount: {
            include: {
              person: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const createTrackingEvent = (data: any) => {
  return prisma.sampleTrackingEvent.create({ data, });
};

export const findSampleByOrderId = ( orderId: string ) => {
  return prisma.sample.findFirst({
    where: { orderId, },

    orderBy: { createdAt: "desc",},
  });
};

// Ownership protection
export const getSampleByIdForClinic = ( id: string, clinicId: string ) => {
  return prisma.sample.findFirst({
    where: {
      id,
      order: {
        clinicId,
      },
    },

    include: {
      order: true,
      patient: true,

      collectedByAccount: {
        include: {
          person: true,
        },
      },

      processedByAccount: {
        include: {
          person: true,
        },
      },

      trackingEvents: {
        include: {
          performedByAccount: {
            include: {
              person: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};