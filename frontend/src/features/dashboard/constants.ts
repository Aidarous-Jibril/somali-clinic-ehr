// src/features/dashboard/constants.ts

// ------------------------------------------------------
// Constants (time slots etc.)
// ------------------------------------------------------

export const DASHBOARD_TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
] as const;

export type DashboardTimeSlot = (typeof DASHBOARD_TIME_SLOTS)[number];
