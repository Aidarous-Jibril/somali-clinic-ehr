// src/features/unit-overview/unitOverviewMockData.ts

import type { CoordinationData, PatientLogEntry, Transfer } from "./types";

// ------------------------------------------------------
// Beds (master data)
// ------------------------------------------------------

export const allBeds = [
  "01: 1",
  "01: 2",
  "02: 1",
  "02: 2",
  "03: 1",
  "04: 1",
  "04: 2",
  "05: 1",
  "05: 2",
  "06: 1",
  "07: 1",
  "08: 1",
  "08: 2",
] as const;

export type BedCode = (typeof allBeds)[number];

export const bedOptions = [
  { code: "01: 1", status: "Occupied" },
  { code: "02: 1", status: "Occupied" },
  { code: "03: 1", status: "Occupied" },
  { code: "04: 1", status: "Reserved" },
  { code: "05: 1", status: "Occupied" },
  { code: "06: 1", status: "Available" },
  { code: "07: 1", status: "Available" },
  { code: "08: 1", status: "Reserved" },
  { code: "09: 1", status: "Available" },
] as const;
