import { prisma } from "../../config/prisma.js";
import { ReferralStatus } from "@prisma/client";

const accountInclude = {
include: {
    person: true,

    assignments: {
      include: {
        unit: true,
      },
    },
  },
};

export const createReferral = ( data: any ) => {
  return prisma.referral.create({
    data,

    include: {
      toUnit: {
        include: {
          clinic: true,
        },
      },

      fromUnit: {
        include: {
          clinic: true,
        },
      },

      fromClinic: true,

      sentByAccount:
        accountInclude,

      patient: true,

      sourcePatient: true,
    },
  });
};

export const findById = ( id: string ) => {
  return prisma.referral.findUnique({
    where: {
      id,
    },
  });
};

export const findByPatient = ( patientId: string, clinicId: string ) => {
  return prisma.referral.findMany({
    where: {
      clinicId,

      OR: [
        { patientId },
        { sourcePatientId: patientId },
      ],
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      toUnit: {
        include: {
          clinic: true,
        },
      },

      fromUnit: {
        include: {
          clinic: true,
        },
      },

      fromClinic: true,

      sentByAccount:
        accountInclude,
    },
  });
};

export const updateStatus = (id: string, status: ReferralStatus ) => {
  return prisma.referral.update({
    where: {
      id,
    },

    data: {
      status,
    },
  });
};

export const findIncoming = ( unitId: string ) => {
  return prisma.referral.findMany({
    where: {
      toUnitId: unitId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      patient: true,
      sourcePatient: true,

      toUnit: {
        include: {
          clinic: true,
        },
      },

      fromUnit: {
        include: {
          clinic: true,
        },
      },

      fromClinic: true,

      sentByAccount:
        accountInclude,
    },
  });
};

export const findOutgoing = (unitId: string ) => {
  return prisma.referral.findMany({
    where: {
      fromUnitId: unitId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      patient: true,
      sourcePatient: true,

      toUnit: {
        include: {
          clinic: true,
        },
      },

      fromUnit: {
        include: {
          clinic: true,
        },
      },

      fromClinic: true,

      sentByAccount:
        accountInclude,
    },
  });
};