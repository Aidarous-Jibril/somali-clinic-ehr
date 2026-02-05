// src/features/consent/mockData.ts

import type { ConsentRecord } from "./types";

export const CONSENT_STATUS_OPTIONS = ["Active", "Ended", "Upcoming", "Cancelled",] as const;

export const initialConsents: ConsentRecord[] = [
  {
    id: "consent-1",
    type: "shared_healthrecord",
    title: "Shared health record",
    organizationLine: "REGION EDUCATION, MEDICINE DIVISION",
    startDate: "2022-04-18",
    endDate: "2022-05-13",
    status: "Active",
  },
  {
    id: "consent-2",
    type: "shared_healthrecord",
    title: "Shared health record",
    organizationLine: "REGION EDUCATION, MEDICINE DIVISION",
    startDate: "2022-02-07",
    endDate: "2022-02-28",
    status: "Ended",
  },
];
