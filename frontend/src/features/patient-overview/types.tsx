// src/features/patient-overview/types.ts/**

/* ========================================================
 * COMMON / SHARED
 * ====================================================== */

export type InfoSource = "myUnit" | "myProvider" | "allProviders";

export type ContextMenuPosition = {
  mouseX: number;
  mouseY: number;
};

/* ========================================================
 * REFERRALS
 * ====================================================== */

export type ReferralStatus =
  | "Unassessed"
  | "Accepted"
  | "In progress"
  | "Completed";

export type ReferralRole =
  | "Doctor"
  | "Nurse"
  | "Physiotherapist"
  | "Occupational therapist"
  | "Dietitian"
  | "Speech therapist"
  | "Midwife"
  | "Other";

export type Referral = {
  id: string;

  to: string;
  from: string;

  status: ReferralStatus;
  date: string;

  urgent?: boolean;
  hasAdditionalInfo?: boolean;
  details?: string;

  sentByName?: string;
  sentByRole?: string;
  sentByUnit?: string;

  // 🔥 ADD THESE
  toUnitId?: string;
  fromUnitId?: string;
};


/* ========================================================
 * ORDERS (LAB / RADIOLOGY / TASKS)
 * ====================================================== */
export type OrderStatus =| "ordered" | "in_progress" | "resulted" | "reviewed" | "completed" ;

export type OrderRepeat = "Never" | "Daily" | "Weekly" | "Monthly";

export type  Order = {
  id: string;
  category: string;      // e.g. Chemistry, Radiology
  name: string;          // e.g. B-EVF
  date: string;          // YYYY-MM-DD or "Today"
  dateTime?: string;

  orderedBy?: string;
  openLabel?: string;    // UI label override
  orderedByStaffId?: string;
  status?: OrderStatus; 
  
  // Optional Cosmic-like metadata
  careContact?: string;
  orderingUnit?: string;
  plannedDate?: string;
  plannedTime?: string;
  repeat?: OrderRepeat;
  requester?: string;
  performer?: string;
  addition?: string;
  comment?: string;
};

/* ========================================================
 * ORDER RESULTS
 * ====================================================== */

export type OrderResultStatus = "pending" | "final";

export type OrderResultFlag =
  | "high"
  | "low"
  | "critical"
  | "normal";

export type OrderResult = {
  id: string;
  orderId: string;       // link to Order.id
  category: string;
  name: string;

  result?: string;
  date?: string;
  flag?: OrderResultFlag;
  status: OrderResultStatus;
  orderStatus?: OrderStatus;
};

/* ========================================================
 * CLINICAL PARAMETERS & LOGS
 * ====================================================== */

export type ClinicalParameterName =
  | "NEWS2"
  | "AVPU"
  | "Respiratory rate"
  | "SpO₂"
  | "Pulse"
  | "Blood pressure"
  | "Body temperature";

export type ClinicalParameter = {
  name: ClinicalParameterName;
  value: string;
  date: string;
  alert?: boolean;
};

export type ClinicalLogEntry = {
  dateTime: string;
  value: string;        // string to support "136/89", "Alert"
  enteredBy?: string;
  note?: string;
};

export type ClinicalLogs = Record<
  ClinicalParameterName,
  ClinicalLogEntry[]
>;

/* ========================================================
 * CLINICAL FORMS
 * ====================================================== */

export type ClinicalRegisterForm = {
  dateTime: string;
  news2: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  hasOxygen: "yes" | "no";
  oxygenLiters: string;
  systolicBP: string;
  diastolicBP: string;
  pulseRate: string;
  temperature: string;
  consciousness: string;
  note: string;
};

export type ClinicalUpdateForm = {
  dateTime: string;
  value: string;
  note: string;
};

export type ConsciousnessOption = {
  value: string;
  label: string;
};

/* ========================================================
 * FLUID BALANCE
 * ====================================================== */

export type FluidBalanceDetails = {
  measuredAt: string;
  oralMl: number;
  oralKcal: number;
  enteralMl: number;
  enteralKcal: number;
  bleedingMl: number;
  faecesMl: number;
  vomitingMl: number;
  urineMl: number;
};

export type FluidBalanceEntry = {
  id: string;
  label: string;
  intakeMl: number;
  outputMl: number;
  balance: string;
  period: string;
  details?: FluidBalanceDetails;
};

export type CreateFluidPayload = {
  measuredAt: string;
  label: string;
  period: string;

  oralMl: number;
  enteralMl: number;

  urineMl: number;
  bleedingMl: number;
  faecesMl: number;
  vomitingMl: number;
};

/* ========================================================
 * CARE CONTACTS
 * ====================================================== */

export type CareContactCategory =
  | "multiple"
  | "inpatient"
  | "outpatient"
  | "secrecy"
  | "none";

export type CareContactEntry = {
  id: string;
  date: string;
  category: Exclude<CareContactCategory, "multiple" | "none">;

  visitType: string;
  unit: string;
  responsible: string;
  role: string;
};

/* ========================================================
 * ATTENTION SIGNALS (WARNINGS / FLAGS)
 * ====================================================== */

export type AttentionCategory =
  | "Hypersensitivity"
  | "Medical Condition and Treatment"
  | "Infection"
  | "Non-routine Care Deviation";

export type AttentionSignalStatus =
  | "active"
  | "ended"
  | "cancelled";

export type AttentionSignalSeverity =
  | "Mild"
  | "Moderate"
  | "Severe"
  | "Harmful";

export type AttentionSignalCertainty =
  | "Suspected"
  | "Probable"
  | "Confirmed";

export type AttentionSignalFlag = {
  kind: "flag" | "info";
  label?: string;
};

export type AttentionSignalLink = {
  label: string;
  href?: string;
};

export type AttentionSignalEntry = {
  id: string;
  category: AttentionCategory;
  title: string;
  status: AttentionSignalStatus;

  assessedAt?: string;
  assessedBy?: string;
  careContact?: string;
  unit?: string;

  severity?: AttentionSignalSeverity;
  certainty?: AttentionSignalCertainty;

  description?: string;
  links?: AttentionSignalLink[];
  flags?: AttentionSignalFlag[];
};

/* ========================================================
 * MEDICATION & VACCINATION
 * ====================================================== */

export type MedicationItem = {
  id: string;
  product: string;
  strength: string;
  dose: string;
  info?: string;
};

export type MedicationSection = {
  id: string;
  title: string;
  items: MedicationItem[];
};

export type VaccinationSection = MedicationSection;

/* ========================================================
 * ENCOUNTERS
 * ====================================================== */

export type Encounter = {
  id: string;
  clinicId: string;
  patientId: string;

  type: "outpatient" | "inpatient" | "emergency" | "telehealth";
  status: "open" | "closed";

  reason?: string;
  notes?: string;

  startedAt: string;
  endedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/* ========================================================
 * ORDER FORMS (UI STATE)
 * ====================================================== */

export type OrderForm = {
  category: string;
  name: string;
  date: string;

  careContact?: string;
  orderingUnit?: string;
  plannedDate?: string;
  plannedTime?: string;
  repeat?: OrderRepeat;
  requester?: string;
  performer?: string;
  addition?: string;
  comment?: string;
};

/* ========================================================
 * CARE OVERVIEW (CALENDAR / HEATMAP)
 * ====================================================== */
export type CareOverviewDayCell = {
  key: string;          // YYYY-MM-DD
  date: Date;
  category: CareContactCategory;
  count: number;
};


/* ========================================================
 * ORDERS (UI HELPERS)
 * ====================================================== */
export type OrderCategoryGroup = {
  category: string;
  items: Order[];
};

/* ========================================================
 * RESULTS (UI HELPERS)
 * ====================================================== */
export type OrderResultCategoryGroup = {
  category: string;
  items: OrderResult[];
};

export type LabMeta = {
  unit?: string;
  ref?: string;
};
