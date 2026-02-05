// src/features/consent/types.ts

export type ConsentStatus = "Active" | "Ended" | "Upcoming" | "Cancelled";

export type ConsentTypeKey = "shared_healthrecord";

export interface ConsentRecord {
  id: string;
  type: ConsentTypeKey;

  // Display text (Cosmic card header + org line)
  title: string; // e.g. "Consent management"
  organizationLine: string; // e.g. "REGION UTBILDNING, MEDICIN DIVISIONEN"

  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  status: ConsentStatus;
}
