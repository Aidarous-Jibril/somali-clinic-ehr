// src/features/dashboard/mockData.ts
import type {
  CareProvider,
  DashboardAppointment,
  ReferralItem,
  SummaryCardModel,
} from "./types";

// ------------------------------------------------------
// Calendar - time slots
// ------------------------------------------------------

export const dashboardTimeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
] as const;

// ------------------------------------------------------
// Care provider (top right dropdown-like button)
// ------------------------------------------------------

export const defaultCareProvider: CareProvider = {
  id: "cp-1",
  name: "Olof Högdal",
  title: "Leg läk",
};

// ------------------------------------------------------
// Appointments (Calendar tab)
// ------------------------------------------------------

export const sampleAppointments: DashboardAppointment[] = [
  {
    id: "apt-1",
    time: "11:00",
    patientId: "19 111111-1111",
    patientName: "Test Name",
    description: "Follow-up visit, doctor",
    status: "Not arrived",
  },
  {
    id: "apt-2",
    time: "13:00",
    patientId: "19 121212-1212",
    patientName: "Example Patient",
    description: "Doctor visit, not arrived",
  },
  {
    id: "apt-3",
    time: "14:00",
    patientId: "19 131313-1313",
    patientName: "Inge Name",
    description: "Doctor follow-up 45 min",
    status: "Not arrived",
  },
];

// ------------------------------------------------------
// Referrals (for dialogs + summary cards)
// NOTE: even if you show Total: 0, keep the "Referrals in" card.
// Cosmic always shows both, and it keeps layout stable.
// ------------------------------------------------------

export const sampleReferrals: ReferralItem[] = [
  // Outgoing
  {
    id: "ref-out-1",
    direction: "out",
    referralDate: "2026-01-20",
    patientId: "19 430632-0005",
    patientName: "Rosa Lavendelblom",
    referralType: "Radiology",
    status: "Accepted",
    recipient: "Radiology dept",
  },
  {
    id: "ref-out-2",
    direction: "out",
    referralDate: "2026-01-20",
    patientId: "19 340932-0011",
    patientName: "Karl Krona",
    referralType: "Physiotherapy",
    status: "Not assessed",
    recipient: "Rehab unit",
  },

  // Incoming example (keep at least 1 for UI testing)
  {
    id: "ref-in-1",
    direction: "in",
    referralDate: "2026-01-20",
    patientId: "19 770932-0001",
    patientName: "Pia Hult",
    referralType: "Medical referral",
    status: "Under assessment",
    sender: "Emergency dept",
  },
];

// ------------------------------------------------------
// Right column cards (Unsigned, Unverified, Q&A)
// ------------------------------------------------------

export const unsignedCard: SummaryCardModel = {
  title: "Unsigned",
  totalText: "(3)",
  bullets: ["Notes – 2", "Medication orders – 1"],
};

export const unverifiedCard: SummaryCardModel = {
  title: "Unverified",
  totalText: "(0)",
  emptyText: "No unverified items.",
};

export const questionsCard: SummaryCardModel = {
  title: "Questions & answers",
  totalText: "(0)",
  emptyText: "No messages requiring your attention.",
};
