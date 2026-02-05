/* ============================================================================
 * MEDICATIONS — UI TABS & PRESENTATION
 * --------------------------------------------------------------------------
 * High-level UI state (tabs, layouts, views)
 * ========================================================================== */

export type MedicationTabKey =
  | "medicationList"
  | "dispensingView"
  | "prescriptionOverview"
  | "vaccinations"
  | "nutritionProducts"
  | "new";

export type PresentationMode = "small" | "large";

/* ============================================================================
 * MEDICATIONS — CORE DOMAIN
 * --------------------------------------------------------------------------
 * Core medication model shared across list, dispensing, and overview
 * ========================================================================== */

export type MedicationGroupKey =
  | "current"
  | "prn"
  | "notScheduled"
  | "generalDirective";

export type AdministrationStatus =
  | "planned"
  | "prepared"
  | "given"
  | "missed"
  | "skipped"
  | "selfAdmin"
  | "notNeeded";

/** One scheduled (or PRN) dose entry */
export interface MedicationScheduleItem {
  /** Stable id for PRN-created doses */
  uid?: string;

  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  label: string;

  tooltip?: string;
  status?: AdministrationStatus;
}

/** A medication order/prescription */
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

/** Grouped medications (Cosmic-style sections) */
export interface MedicationGroup {
  key: MedicationGroupKey;
  title: string;
  items: Medication[];
}

/* ============================================================================
 * PRESCRIPTION OVERVIEW
 * --------------------------------------------------------------------------
 * Flattened rows used in prescription overview / summary screens
 * ========================================================================== */

export type PrescriptionStatus = "active" | "notStarted";

export type PrescriptionRow = {
  id: string;
  name: string;
  strength?: string;
  dosingText: string;
  startDate?: string | null;
  groupTitle: string;
  status: PrescriptionStatus;
};

/* ============================================================================
 * VACCINATIONS
 * --------------------------------------------------------------------------
 * Vaccination timeline, card, and administration data
 * ========================================================================== */

export type VaccinationStatus = "planned" | "given";

/** Single vaccination event (dose) */
export interface VaccinationEvent {
  at: string;        // ISO datetime (e.g. 2025-05-08T08:13)
  doseLabel: string; // "1 dose"
  status: VaccinationStatus;
}

/** Vaccination prescription */
export interface Vaccination {
  id: string;
  name: string;
  atcCode: string;
  form: string;
  route: string;
  reason: string;
  startDate: string; // YYYY-MM-DD
  tooltip?: string;

  events: VaccinationEvent[];
}

/* ------------------------ Timeline helpers ------------------------ */

/** Timeline range selector */
export type VaccinationRange =
  | "15m"
  | "1h"
  | "1d"
  | "1w"
  | "1m"
  | "1y"
  | "10y";

/** Timeline tick mark */
export type TimelineTick = {
  x: number;
  bottomLabel: string;
  topLabel?: string;
};

/** Flattened event row (used by vaccination card dialog) */
export type VaccinationEventRow = {
  vaccination: Vaccination;
  event: VaccinationEvent;
};

/* ============================================================================
 * NUTRITION
 * --------------------------------------------------------------------------
 * Nutrition products & prescriptions
 * ========================================================================== */

export type NutritionStatusFilter = "valid" | "all" | "expired";

/** Nutrition prescription */
export interface NutritionPrescription {
  id: string;
  prescribedAt: string;

  productName: string;
  description?: string;
  articleNo?: string;
  productArea?: string;
  validUntil?: string;
  prescriber?: string;

  issuedDate?: string;
  prescribedOn?: string;
  unit?: string;
  packages?: number;
  withdrawals?: number;
  firstWithdrawalBefore?: string;
  benefit?: "Yes" | "No";
  otherInstruction?: string;
  dosingInstruction?: string;

  uuid?: string;
  sendStatus?: string;
  sentAt?: string;
}

/* ============================================================================
 * FAVORITE PRESCRIPTION TEMPLATES
 * --------------------------------------------------------------------------
 * Used when creating new medications (templates / shortcuts)
 * ========================================================================== */

export interface FavoriteTemplate {
  id: string;
  treatmentReason: string;
  templateName: string;

  product: string;
  form: string;
  strength: string;
  dosing: string;

  route?: string;
  recommended?: boolean;
  eped?: boolean;
}

/* ============================================================================
 * DISPENSING / ADMINISTRATION (DOSE-LEVEL)
 * --------------------------------------------------------------------------
 * Administration, signing, handover, audit
 * ========================================================================== */

/** Reference to a specific scheduled (or PRN) dose */
export type DoseRef = {
  medId: string;
  item: MedicationScheduleItem;
};

/** Effective status for a dose */
export type DoseStatus =
  | NonNullable<MedicationScheduleItem["status"]>
  | "planned";

/* ---------------------- Dose metadata & audit ---------------------- */

export type DoseMeta = {
  prepared?: boolean;
  selfAdmin?: boolean;

  comment?: string;
  skipReason?: string;
  deviationReason?: string;

  signedById?: string;

  handoverToId?: string;
  handoverNote?: string;

  /** Override display label (e.g. injections / PRN) */
  labelLine1?: string;
  labelLine2?: string;

  /* -------------------- Infusion-specific fields -------------------- */

  infusionOrderedMl?: number;
  infusionPreparedMl?: number;
  infusionRateMlHr?: number;
  infusionStartAt?: string;
  infusionRunning?: boolean;

  infusionEndAt?: string;
  infusionInfusedMl?: number;
  infusionTotalInfusedMl?: number;
};

/* ---------------------- Admin action dialog ------------------------ */

export type AdminKind = "administer" | "selfAdmin" | "skip";

/** Shared props contract for admin dialogs */
export type AdminActionDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;

  adminKind: AdminKind;

  selectedDoses: DoseRef[];
  primarySelected: DoseRef | null;
  selectedMed: any | null;

  includedKeys: Record<string, boolean>;
  setIncludedKeys: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  adminDoseByKey: Record<string, string>;
  setAdminDoseByKey: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  adminTime: string;
  setAdminTime: React.Dispatch<React.SetStateAction<string>>;

  adminComment: string;
  setAdminComment: React.Dispatch<React.SetStateAction<string>>;

  adminReason: string;
  setAdminReason: React.Dispatch<React.SetStateAction<string>>;

  formError: string | null;
  setFormError: React.Dispatch<React.SetStateAction<string | null>>;

  SignedByBlock: React.ReactNode;

  getMed: (medId: string) => any | null;
  doseRefKey: (d: DoseRef) => string;
  isDirective: (m?: any | null) => boolean;
  isDoseRequiringAdminDose: (m: any | null) => boolean;
};

/* ============================================================================
 * PRN actions
 * ========================================================================== */

export type PrnAction = | "add" | "prepare" | "administer" | "selfAdmin";

/* ============================================================================
 * Medication schedule / timeline
 * ========================================================================== */

export type TimeRangeKey = | "15m" | "1h" | "1d" | "1w" | "1m" | "1y" | "2y";

export interface MedicationEvent {
  at: string; // ISO date-time
  label: string;
}

export type MedicationScheduleRow =
  | {
      type: "group";
      key: string;
      title: string;
      count: number;
    }
  | {
      type: "med";
      key: string;
      med: { id: string };
    };
