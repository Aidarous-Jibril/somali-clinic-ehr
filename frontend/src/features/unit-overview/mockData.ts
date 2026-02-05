// src/features/unit-overview/unitOverviewMockData.ts

import type { CoordinationData, Inpatient, PatientLogEntry, Transfer } from "./types";

// ------------------------------------------------------
// Facilities + units (master data)
// ------------------------------------------------------

export const facilityOptions = [
  "Somali Clinic - Hargeisa",
  "Hargeisa General Hospital",
  "Borama Regional Hospital",
  "Burao District Hospital",
] as const;

export type FacilityOption = (typeof facilityOptions)[number];

export const unitsByFacility: Record<FacilityOption, string[]> = {
  "Somali Clinic - Hargeisa": [
    "Stroke ward",
    "Medicine ward 1",
    "Medicine ward 2",
    "Emergency dept",
  ],
  "Hargeisa General Hospital": ["Emergency dept", "Internal medicine", "Surgery", "ICU"],
  "Borama Regional Hospital": ["Emergency dept", "Medicine", "Maternity"],
  "Burao District Hospital": ["Emergency dept", "Medicine", "Surgery"],
};

export const unitOptions = [
  "Stroke ward",
  "Medicine ward 1",
  "Medicine ward 2",
  "Emergency dept, Medicine division",
  "Surgery ward 1, Surgery division",
] as const;

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

// ------------------------------------------------------
// Mock inpatients (active contacts)
// ------------------------------------------------------

export const sampleInpatients: Inpatient[] = [
  {
    bed: "01: 1",
    nationalId: "19 900201-2384",
    name: "Malin Sten",
    ews: 2,
    facility: "Somali Clinic - Hargeisa",
    ward: "Stroke ward",
    startDate: "2025-12-03 09:20",
    team: "Blue team",
    activity: "",
    coordination: { hasCase: true },
    plannedDischarge: { dateTime: "2025-12-16 08:51", status: "notEvaluated" },
  },
  {
    bed: "03: 1",
    nationalId: "19 300934-0013",
    name: "Gustaf Hedin",
    ews: 4,
    facility: "Somali Clinic - Hargeisa",
    ward: "Stroke ward",
    startDate: "2025-11-28 10:30",
    team: "Green team",
    activity: "",
    plannedDischarge: { dateTime: "2025-12-16 15:10", status: "safe" },
  },
  {
    bed: "04: 1",
    nationalId: "19 390832-0009",
    name: "Carina Stensjö",
    ews: 6,
    facility: "Somali Clinic - Hargeisa",
    ward: "Stroke ward",
    startDate: "2025-12-01 11:00",
    team: "Green team",
    activity: "11:00",
    plannedDischarge: { dateTime: "2025-12-15 08:56", status: "possible" },
  },
];

// ------------------------------------------------------
// Mock transfers (inbound + outbound)
// ------------------------------------------------------

export const sampleTransfers: Transfer[] = [
  // Inbound example
  {
    id: "t1",
    direction: "inbound",
    type: "From ER",
    name: "Helena Skogslönn",
    nationalId: "19 340232-0000",
    fromFacility: "Hargeisa General Hospital",
    toFacility: "Somali Clinic - Hargeisa",
    fromUnit: "Emergency dept",
    toUnit: "Medicine ward 1",
    transferTime: "2025-12-13 10:04",
    status: "planned",
  },

  // Outbound example
  {
    id: "t2",
    direction: "outbound",
    type: "Outbound transfer",
    name: "Kajsa Samuelsson",
    nationalId: "19 230832-0007",
    fromFacility: "Somali Clinic - Hargeisa",
    toFacility: "Borama Regional Hospital",
    fromUnit: "Medicine ward 1",
    toUnit: "Emergency dept",
    transferTime: "2025-12-13 11:00",
    reason: "Needs surgical evaluation",
    transferDecided: true,
    patientReady: true,
    status: "completedToday",
  },
];

// ------------------------------------------------------
// Coordination mock cases (existing saved cases)
// ------------------------------------------------------

export const sampleCoordinationCases: Record<string, CoordinationData> = {
  "19 900201-2384": {
    infoSharingConsent: "yes",
    coordinationNeeded: "yes",
    sipConsent: "notAsked",
    adminComment: "Needs SIP planning before discharge.",
    recipients: [
      { type: "Municipality", unit: "Stroke ward" },
      { type: "Outpatient care", unit: "Medicine ward 1" },
    ],
  },
};

// ------------------------------------------------------
// Patient logs (mock read-only log entries)
// ------------------------------------------------------

export const samplePatientLogs: Record<string, PatientLogEntry[]> = {
  "19 900201-2384": [
    {
      dateTime: "2025-12-09 14:49:26",
      category: "Arrival time",
      text: "2025-12-08 14:49",
      author: "AnnAnd",
    },
    {
      dateTime: "2025-12-09 14:49:26",
      category: "Reason",
      text: "Observation",
      author: "AnnAnd",
    },
    {
      dateTime: "2025-12-09 15:14:02",
      category: "Team",
      text: "Red team",
      author: "AnnAnd",
    },
    {
      dateTime: "2025-12-09 15:09:57",
      category: "Confidentiality",
      text: "Patient not asked",
      author: "AnnAnd",
    },
    {
      dateTime: "2025-12-09 14:49:26",
      category: "Medical responsible unit",
      text: "Medicine division",
      author: "AnnAnd",
    },
  ],
};
