import * as repo from "./appointment.repository.js";
import { prisma } from "../../config/prisma.js";


const normalizeTime = (date: Date) => {
  const d = new Date(date);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

export const createAppointment = async (input: any) => {
  const start = normalizeTime(new Date(input.scheduledAt));

  // PREVENT PAST BOOKINGS
  if (start < new Date()) {
    throw new Error("Cannot book in the past");
  }

  // WORKING HOURS (08–17)
  const hour = start.getHours();
  if (hour < 8 || hour >= 20) {
    throw new Error("Appointment must be within 08:00 - 20:00");
  }

  const duration = input.duration || 30;
  const end = new Date(start.getTime() + duration * 60 * 1000);

  // CONFLICT CHECK
  const existing = await prisma.appointment.findFirst({
    where: {
      doctorAssignmentId: input.doctorAssignmentId,
      clinicId: input.clinicId,
      scheduledAt: {
        gte: new Date(start.getTime() - duration * 60 * 1000),
        lt: end,
      },
      status: {
        in: ["booked", "arrived", "in_progress"],
      },
    },
  });

  if (existing) {
    throw new Error("Doctor already has an appointment in this time slot");
  }

  return repo.createAppointment({
    ...input,
    scheduledAt: start, // 🔥 normalized time
  });
};
export const listAppointments = async (query: any) => {
  const filters: any = { clinicId: query.clinicId, };

  if (query.doctorAssignmentId)
  filters.doctorAssignmentId = query.doctorAssignmentId;

  if (query.patientId) 
    filters.patientId = query.patientId;

  if (query.status) 
    filters.status = query.status;

  return repo.findAppointments(filters);
};

// ---------------------
// LIFECYCLE
// ---------------------

export const markArrived = (id: string) =>
  repo.updateAppointment(id, {
    status: "arrived",
  });

export const startAppointment = async (id: string) => {
  const appointment = await repo.findById(id);
  if (!appointment) 
    throw new Error("Appointment not found");

  if (appointment.encounterId) 
    throw new Error("Encounter already exists");

  // CREATE ENCOUNTER (VERY IMPORTANT)
  return prisma.$transaction(async (tx) => {
    const encounter = await tx.encounter.create({
      data: {
        clinicId: appointment.clinicId,
        patientId: appointment.patientId,
        type: "outpatient",
        status: "open",
      },
    });

    return tx.appointment.update({
      where: { id },
      data: {
        status: "in_progress",
        encounterId: encounter.id,
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
    });
  });
  };

export const completeAppointment = async (id: string) => {
  const appointment = await repo.findById(id);

  if (!appointment) throw new Error("Appointment not found");

  return prisma.$transaction(async (tx) => {
    if (appointment.encounterId) {
      await tx.encounter.update({
        where: { id: appointment.encounterId },
        data: {
          status: "closed",
          endedAt: new Date(),
        },
      });
    }

    return tx.appointment.update({
      where: { id },
      data: {
        status: "completed",
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
    });
  });
};


export const cancelAppointment = async (id: string, user: any) => {
  const appointment = await repo.findById(id);

  if (!appointment) throw new Error("Appointment not found");
  if (appointment.clinicId !== user.clinicId) throw new Error("Forbidden");

  if (appointment.status === "completed")
    throw new Error("Cannot cancel completed appointment");

  if (appointment.status === "cancelled")
    throw new Error("Appointment already cancelled");

  return repo.updateAppointment(id, {
    status: "cancelled",
  });
};


export const getTodayAppointments = async (user: any, query: any) => {
  if (!user?.clinicId) {
    throw new Error("Missing clinic context");
  }

  //  SUPPORT CUSTOM DATE
  const baseDate = query?.date ? new Date(query.date) : new Date();

  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(baseDate);
  end.setHours(23, 59, 59, 999);

  return repo.findTodayAppointments({
    clinicId: user.clinicId,
    start,
    end,
  });
};