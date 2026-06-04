// src/features/appointments/types.ts

export type AppointmentStatus =
  | "booked"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export type Appointment = {
  id: string;
  scheduledAt: string;
  status: AppointmentStatus;

  patient?: {
    id: string;
    firstName: string;
    lastName: string;
  };

  doctor?: {
    id: string;
    name: string;
  };

  encounterId?: string;
};