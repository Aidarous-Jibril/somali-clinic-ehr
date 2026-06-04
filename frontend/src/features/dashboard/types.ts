// src/features/dashboard/types.ts

import type { AppointmentStatus } from "../appointments/types";

// ------------------------------------------------------
// Filters + tabs
// ------------------------------------------------------

export type DashboardFilterScope = "selected" | "all";

export type DashboardTabKey = "calendar" | "patients";

// ------------------------------------------------------
// Calendar / appointments
// ------------------------------------------------------

export type DashboardAppointment = {
  id: string;
  time: string;
  patientId: string;
  patientName: string;
  nationalId?: string | null;
  phone?: string | null;
  description: string;
  status?: AppointmentStatus;
};

// ------------------------------------------------------
// Referrals
// ------------------------------------------------------

export type ReferralDirection = "out" | "in";

export type ReferralStatus =
  | "Unassessed"
  | "Accepted"
  | "In progress"
  | "Completed";

export type ReferralItem = {
  id: string;
  direction: ReferralDirection;
  referralDate: string;
  patientId: string;
  patientName: string;
  referralType: string;
  status: ReferralStatus;
  recipient?: string;
  sender?: string;
};

// ------------------------------------------------------
// Patients tab
// ------------------------------------------------------

export type DashboardPatientItem = {
  patientId: string;
  patientName: string;
  nationalId?: string | null;
  phone?: string | null;
};