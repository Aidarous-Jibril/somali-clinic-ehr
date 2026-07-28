// src/features/dashboard/types.ts

import type { AppointmentStatus } from "../appointments/types";

// ------------------------------------------------------
// Filters + tabs
// ------------------------------------------------------

export type DoctorFilterScope = "selected" | "all";

export type DoctorTabKey = "calendar" | "patients";

// ------------------------------------------------------
// Calendar / appointments
// ------------------------------------------------------

export type DoctorAppointment = {
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

export type Severity = "normal" | "warning" | "danger";

export type DashboardCardProps = {
  title: string;
  value: string | number;
  severity?: Severity;
  badge?: string;
  onClick?: () => void;
};