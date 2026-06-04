// src/features/unit-overview/constants.ts

import type { CoordinationData } from "./types";

// Keep these as "UI domain options" (NOT mock data).
// Mock data = sample patients/transfers/cases. Constants = option lists + labels.

export const MEDICAL_RESPONSIBLE_UNIT_OPTIONS = [ "(All units)", "Medicine division", "Surgery division",] as const;

export type MedicalResponsibleUnitOption = (typeof MEDICAL_RESPONSIBLE_UNIT_OPTIONS)[number];

export const WARD_UNIT_FILTER_OPTIONS = [ "Stroke ward", "Medicine ward 1", "Medicine ward 2" ] as const;

export type WardUnitFilterOption = (typeof WARD_UNIT_FILTER_OPTIONS)[number];

// Tabs (optional, but nice to centralize labels)
export const UNIT_OVERVIEW_TABS = [
  { key: "active", label: "Active contacts" },
  { key: "booked", label: "Booked contacts" },
  { key: "transfers", label: "Transfers" },
  { key: "completed", label: "Completed contacts" },
] as const;

export type UnitOverviewTabKey = (typeof UNIT_OVERVIEW_TABS)[number]["key"];

// src/features/unit-overview/constants.ts

export const RECIPIENT_TYPES = [ "Municipality", "Outpatient care", "Inpatient care", "Other actor", ] as const;

export const DEFAULT_COORDINATION_FORM: CoordinationData = {
  infoSharingConsent: "notAsked",
  coordinationNeeded: "notAsked",
  sipConsent: "notAsked",
  adminComment: "",
  recipients: [],
} as const;