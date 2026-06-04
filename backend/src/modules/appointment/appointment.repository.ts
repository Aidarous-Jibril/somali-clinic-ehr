import { prisma } from "../../config/prisma.js";

// CREATE
export const createAppointment = (data: any) => {
  return prisma.appointment.create({
    data,
    include: {
      patient: true,
      unit: true,
      doctorAssignment: {
        include: {
          account: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
};

// UPDATE
export const updateAppointment = (id: string, data: any) => {
  return prisma.appointment.update({
    where: { id },
    data,
    include: {
      patient: true,
      unit: true,
      doctorAssignment: {
        include: {
          account: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
};

// LIST
export const findAppointments = (filters: any) => {
  return prisma.appointment.findMany({
    where: filters,
    orderBy: { scheduledAt: "asc" },
    include: {
      patient: true,
      unit: true,
      doctorAssignment: {
        include: {
          account: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
};

// FIND BY ID
export const findById = (id: string) => {
  return prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      unit: true,
      doctorAssignment: {
        include: {
          account: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
};

// TODAY
export const findTodayAppointments = (params: { clinicId: string; unitId?: string; start: Date; end: Date; }) => {
  return prisma.appointment.findMany({
    where: {
      clinicId: params.clinicId,
      ...(params.unitId && { unitId: params.unitId }),
      scheduledAt: {
        gte: params.start,
        lte: params.end,
      },
    },
    include: {
      patient: true,
      unit: true,
      doctorAssignment: {
        include: {
          account: {
            include: {
              person: true,
            },
          },
        },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });
};