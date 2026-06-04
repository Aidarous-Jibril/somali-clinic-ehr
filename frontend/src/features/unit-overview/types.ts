// src/features/unit-overview/types.ts

// ------------------------------------------------------
// Shared
// ------------------------------------------------------

export type DateTimeString = string;
export type YesNoUnknown = "yes" | "no" | "notAsked";

// ------------------------------------------------------
// Coordination
// ------------------------------------------------------

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
  infoSharingConsent: YesNoUnknown;
  coordinationNeeded: YesNoUnknown;
  sipConsent: YesNoUnknown;
  adminComment: string;
  recipients: CoordinationRecipient[];
};

export type CoordinationPayload = CoordinationData & {
  stayId: string;
};

// ------------------------------------------------------
// Planning
// ------------------------------------------------------

export type PlannedDischargeStatus =
  | "notEvaluated"
  | "possible"
  | "safe";

export type PlannedDischarge = {
  dateTime: DateTimeString;
  status: PlannedDischargeStatus;
};

export type PlannedTransfer = {
  dateTime?: DateTimeString | null;
  unit: string;
};

export type SavePlannedDischargePayload = {
  stayId: string;
  date: string;
  time: string;
  status: string;
};

// ------------------------------------------------------
// Inpatient
// ------------------------------------------------------

export type Inpatient = {
  id: string;
  encounterId: string;

  bed: string;
  nationalId: string;
  name: string;

  ward: string;
  team: string;
  startDate: DateTimeString;

  ews?: number;
  facility?: string;
  technicalUnit?: string;
  absence?: string;
  activity?: string;

  coordination?: { hasCase: boolean };
  plannedDischarge?: PlannedDischarge;
  plannedTransfer?: PlannedTransfer;
};

// ------------------------------------------------------
// Transfers
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
  status: TransferStatus;

  bedReserved?: string;
  technicalUnit?: string;
  specialBedNeeds?: string;
  reason?: string;
  transferDecided?: boolean;
  patientReady?: boolean;
};

export type PlanTransferPayload = {
  stayId: string;
  staffId: string;
  clinicId: string;

  type: string;

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

export type ReserveBedPayload = {
  referralId: string;
  bedCode: string;
};

export type TransferNowPayload = {
  referralId: string;
};

// ------------------------------------------------------
// Dialog Forms
// ------------------------------------------------------

export type AdmitPatientData = {
  nationalId: string;
  name: string;
  bed: string;
  ward: string;
  team: string;
  startDate: string;
  startTime: string;
  ews: string;
};

export type AdmitPatientPayload = AdmitPatientData & {
  clinicId: string;
};

export type ChangeBedPayload = {
  stayId: string;
  bedCode: string;
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
// Beds
// ------------------------------------------------------

export type BedSelectOption = {
  id: string;
  label: string;
  disabled?: boolean;
};

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