// src/features/dashboard/types.ts

// ------------------------------------------------------
// Filters + tabs
// ------------------------------------------------------

export type DashboardFilterScope = "selected" | "all";
export type DashboardTabKey = "calendar" | "patients" | "links";

// ------------------------------------------------------
// Care provider
// ------------------------------------------------------

export type CareProvider = {
  id: string;
  name: string; // "Olof Högdal"
  title?: string; // "Leg läk"
};

// ------------------------------------------------------
// Calendar / appointments
// ------------------------------------------------------

export type AppointmentStatus = "Not arrived" | "Arrived" | "Completed" | "Cancelled";

export type DashboardAppointment = {
  id: string;
  time: string; // "11:00"
  patientId: string; // "19 111111-1111"
  patientName: string;
  description: string;
  status?: AppointmentStatus;
};

// ------------------------------------------------------
// Referrals
// ------------------------------------------------------

export type ReferralDirection = "out" | "in";

export type ReferralStatus =
  | "Saved"
  | "Not assessed"
  | "Under assessment"
  | "Accepted"
  | "Ongoing";

export type ReferralItem = {
  id: string;
  direction: ReferralDirection;

  referralDate: string; // "2026-01-20"
  patientId: string;
  patientName: string;

  referralType: string; // "Radiology", "Physio", ...
  status: ReferralStatus;

  recipient?: string; // "Radiology dept", "VC Nord", ...
  sender?: string; // optional
};

// Summary card model (Cosmic-style right column boxes)
export type SummaryRow = {
  label: string;
  value: number;
  muted?: boolean;
};

export type SummaryCardModel = {
  title: string;
  totalText?: string; // "Total: 7" or "(3)"
  rows?: SummaryRow[];
  bullets?: string[];
  emptyText?: string;
  onOpenLabel?: string; // optional hint text for clickable header
};
