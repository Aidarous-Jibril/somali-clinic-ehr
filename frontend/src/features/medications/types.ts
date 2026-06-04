// src/features/medications/types.ts

/* ============================================================================
 * MEDICATIONS — UI
 * ========================================================================== */
export type MedicationTabKey = | "medicationList" | "dispensingView" | "prescriptionOverview" | "vaccinations" | "nutritionProducts" | "new";

export type PresentationMode = "small" | "large";

/* ============================================================================
 * MEDICATIONS — CORE DOMAIN
 * ========================================================================== */
export type MedicationGroupKey = | "current" | "prn" | "notScheduled" | "generalDirective";

export type AdministrationStatus = | "planned" | "prepared" | "given" | "missed" | "skipped" | "selfAdmin" | "notNeeded";

/** One scheduled (or PRN) dose */
export interface MedicationScheduleItem {
  uid?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  label: string;
  tooltip?: string;
  status?: AdministrationStatus;
}

/** Medication order */
export interface Medication {
  id: string;
  group: MedicationGroupKey;
  name: string;
  strength?: string;
  dosingText: string;
  startDate: string;
  tooltip: string;
  schedule?: MedicationScheduleItem[];
}

/** Grouped medications */
export interface MedicationGroup {
  key: MedicationGroupKey;
  title: string;
  items: Medication[];
}

/* ============================================================================
 * REGISTER MEDICATION
 * ========================================================================== */
export interface RegisterMedicationInput {
  name: string;
  strength?: string;
  dose: string;
  frequency: | "once_daily" | "twice_daily" | "three_times_daily" | "four_times_daily" | "as_needed";
  indication?: string;
}

/* ============================================================================
 * PRESCRIPTION OVERVIEW
 * ========================================================================== */
export type PrescriptionStatus = "active" | "notStarted";

export interface PrescriptionRow {
  id: string;
  name: string;
  strength?: string;
  dosingText: string;
  startDate?: string | null;
  groupTitle: string;
  status: PrescriptionStatus;
}

/* ============================================================================
 * PRN ACTIONS
 * ========================================================================== */
export type PrnAction = | "add" | "prepare" | "administer" | "selfAdmin";

/* ============================================================================
 * BACKEND DTOs
 * ========================================================================== */
export interface MedicationDoseDto {
  id: string;
  scheduledAt: string;
  status: string;
  administeredAt?: string | null;
}

export interface MedicationDto {
  id: string;
  patientId: string;
  clinicId: string;
  encounterId?: string | null;

  name: string;
  dose: string;
  dosingText?: string | null;
  form?: string | null;
  frequency: string;
  groupType: string;
  indication?: string | null;

  createdAt: string;
  endDate?: string | null;

  doses?: MedicationDoseDto[];
}

/* ============================================================================
 * VACCINATIONS
 * ========================================================================== */
export type VaccinationRecordStatus = | "active" | "completed" | "declined";

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  dose?: string | null;
  status: VaccinationRecordStatus;
  administeredAt: string;
  administeredBy?: string | null;
}


export interface RegisterVaccinationInput {
  patientId: string;
  encounterId?: string;

  vaccineName: string;
  dose?: string;

  manufacturer?: string;
  batchNumber?: string;
  administeredAt?: string;
  notes?: string;
}

/* ============================================================================
 * NUTRITION PRODUCTS
 * ========================================================================== */
export type NutritionStatus = "valid" | "expired" | "cancelled";

export type NutritionStatusFilter =
  | "valid"
  | "expired"
  | "all";

export interface NutritionProductRecord {
  id: string;
  prescribedDate: string;
  product: string;
  description?: string;
  articleNumber?: string;
  productArea?: string;
  validUntil?: string;
  prescriber?: string;
  status: NutritionStatus;
}

export interface NutritionPrescription {
  id: string;
  patientId: string;

  productName: string;
  description?: string | null;
  articleNo?: string | null;
  productArea?: string | null;

  prescribedAt: string;
  validUntil?: string | null;

  prescriber?: string | null;
  status: NutritionStatus;
}

export interface RegisterNutritionPrescriptionInput {
  patientId: string;

  productName: string;
  description?: string;
  articleNo?: string;
  productArea?: string;

  prescribedAt?: string;
  validUntil?: string;

  prescriber?: string;
}