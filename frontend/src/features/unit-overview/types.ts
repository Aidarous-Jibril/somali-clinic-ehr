// src/features/unit-overview/types.ts

// ------------------------------------------------------
// Shared / core types
// ------------------------------------------------------

export type DateTimeString = string; // "YYYY-MM-DD HH:mm"

// ------------------------------------------------------
// Coordination (Samordning)
// ------------------------------------------------------

export type ConsentValue = "yes" | "no" | "notAsked";

export type RecipientType =
  | "Municipality"
  | "Outpatient care"
  | "Inpatient care"
  | "Other actor";

export type CoordinationRecipient = {
  type: RecipientType;
  unit: string;
};

export type CoordinationData = {
  infoSharingConsent: ConsentValue;
  coordinationNeeded: ConsentValue;
  sipConsent: ConsentValue;
  adminComment: string;
  recipients: CoordinationRecipient[];
};

// ------------------------------------------------------
// Planned discharge
// ------------------------------------------------------

export type PlannedDischargeStatus = "notEvaluated" | "possible" | "safe";

export type PlannedDischarge = {
  dateTime: DateTimeString;
  status: PlannedDischargeStatus;
};

// ------------------------------------------------------
// Inpatient (Active contact)
// ------------------------------------------------------

export type Inpatient = {
  // Placement
  bed: string;

  // Identity
  nationalId: string;
  name: string;

  // Monitoring
  ews?: number;

  // Organization (MVP facility layer)
  facility: string;
  ward: string;

  // Timeline
  startDate: DateTimeString;

  // Optional workflow fields
  technicalUnit?: string;
  team: string;
  absence?: string;
  activity?: string;

  // Coordination & discharge planning
  coordination?: { hasCase: boolean };
  plannedDischarge?: PlannedDischarge;
};

// ------------------------------------------------------
// Transfers (domain type)
// ------------------------------------------------------

export type TransferStatus = "planned" | "completedToday";
export type TransferDirection = "inbound" | "outbound";

export type Transfer = {
  id: string;
  direction: TransferDirection;
  type: string;

  name: string;
  nationalId: string;

  fromFacility: string;
  toFacility: string;

  fromUnit: string;
  toUnit: string;

  transferTime: DateTimeString;

  bedReserved?: string;

  technicalUnit?: string;
  specialBedNeeds?: string;
  reason?: string;
  transferDecided?: boolean;
  patientReady?: boolean;

  status: TransferStatus;
};

// ------------------------------------------------------
// Dialog payload types (moved from dialogs)
// ------------------------------------------------------

export type AdmitPatientData = {
  nationalId: string;
  name: string;
  bed: string;

  ward: string;
  team: string;

  startDate: string;
  startTime: string;

  ews: string; // keep as string; caller can parse
};

export type BedSelectOption = {
  id: string; // e.g. "01: 2"
  label: string;
  disabled?: boolean; // occupied beds
};

export type TransferPatientData = {
  type: "Same episode" | "New episode" | "Other hospital";

  fromFacility: string;
  fromUnit: string;

  toFacility: string;
  toUnit: string;

  transferDate: string;
  transferTime: string;

  technicalUnit: string;
  specialBedNeeds: string;

  reason: string;
  transferDecided: boolean;
  patientReady: boolean;
};

// ------------------------------------------------------
// Bed UI option types (moved from dialogs)
// ------------------------------------------------------

export type BedOption = {
  id: string;
  label: string;
  status: "free" | "reserved" | "occupied";
};

export type BedChangeOption = {
  id: string;
  label: string;
  status: "free" | "occupied";
};

// ------------------------------------------------------
// Logs
// ------------------------------------------------------

export type EwsEntry = {
  dateTime: DateTimeString;
  score: number;
};

export type PatientLogEntry = {
  dateTime: DateTimeString;
  category: string;
  text: string;
  author?: string;
};
