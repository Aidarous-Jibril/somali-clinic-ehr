import { prisma } from "../../../config/prisma.js";


export const getAssignedPatients = async (unitId: string) => {
  return prisma.inpatientStay.findMany({
    where: {
      unitId,
      dischargedAt: null,
    },
    include: {
      patient: true,
      encounter: true,
      unit: true,
    },
    orderBy: {
      admittedAt: "desc",
    },
  });
};

export const getMedicationDueNow = async (unitId: string) => {
  return prisma.medicationDose.findMany({
    where: {
      status: "planned",
      scheduledDate: {
        lte: new Date(),
      },
      medication: {
        status: "active",
        patient: {
          inpatientStays: {
            some: {
              unitId,
              dischargedAt: null,
            },
          },
        },
      },
    },
    include: {
      medication: {
        include: {
          patient: true,
        },
      },
    },
    orderBy: {
      scheduledDate: "asc",
    },
  });
};

export const getActiveStaysWithLatestVitals = async (unitId: string) => {
  return prisma.inpatientStay.findMany({
    where: {
      unitId,
      dischargedAt: null,
    },
    include: {
      patient: true,
      encounter: {
        include: {
          clinicalParameterEntries: {
             where: {
              name: "NEWS2",
            },
            orderBy: {
              recordedAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
  });
};

export const getActiveStaysWithFluidBalances = ( unitId: string ) => {
  return prisma.inpatientStay.findMany({
    where: {
      dischargedAt: null,
      unitId,
    },
    include: {
      patient: true,
      encounter: {
        include: {
          fluidBalanceEntries: {
            orderBy: {
              measuredAt: "desc",
            },
            include: {
              details: true,
            },
          },
        },
      },
    },
  });
};


export const getPendingReferralsForUnit = async (unitId: string) => {
  return prisma.referral.findMany({
    where: {
      toUnitId: unitId,
      status: "unassessed",
    },
    include: {
      patient: true,
      fromClinic: true,
      fromUnit: true,
    },
    orderBy: [
      {
        urgent: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

export const getWardOccupancy = async (unitId: string) => {
  return prisma.unit.findUnique({
    where: {
      id: unitId,
    },
    include: {
      inpatientStays: {
        where: {
          dischargedAt: null,
        },
        include: {
          patient: true,
        },
      },
    },
  });
};