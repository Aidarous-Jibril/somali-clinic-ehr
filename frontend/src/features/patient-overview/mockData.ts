// src/features/patient-overview/mockData.ts
import type {
  Referral,
  Order,
  OrderResult,
  FluidBalanceEntry,
  ClinicalLogEntry,
  ClinicalParameterName,
  FluidBalanceDetails,
  ReferralRole,
  VaccinationSection,
  MedicationSection,
  CareContactEntry,
  AttentionSignalEntry,
  LabMeta,
} from "./types";

/* ========================================================
 * STAFF & ROLES
 * Used by: Referrals, forms
 * ====================================================== */
export const STAFF_BY_ROLE: Record<ReferralRole, string[]> = {
  Doctor: ["A. Ahmed, MD", "Johan Svärd, MD", "Fatima Osman, MD"],
  Nurse: ["Ayaan Hassan, RN", "Sahra Ali, RN", "Hodan Yusuf, RN"],
  Physiotherapist: ["Herbert Kurz, PT", "Abdi Noor, PT"],
  "Occupational therapist": ["Samira Warsame, OT"],
  Dietitian: ["Leyla Ahmed, Dietitian"],
  "Speech therapist": ["Mohamed Ibrahim, SLP"],
  Midwife: ["Nimco Abdi, Midwife"],
  Other: ["Current user"],
};

/* ========================================================
 * REFERRALS
 * Used by: Patient overview, Dashboard summary
 * ====================================================== */
export const MOCK_REFERRALS: Referral[] = [
  {
    id: "ref-1",
    to: "Medical division",
    from: "District health centre North",
    sentByRole: "Doctor",
    sentByName: "Johan Svärd, MD",
    sentByUnit: "Outpatient clinic",
    status: "Completed",
    date: "2025-10-16",
    urgent: false,
    hasAdditionalInfo: true,
    details: "Complementary answer",
  },
  {
    id: "ref-2",
    to: "Medical division",
    from: "District health centre North",
    sentByRole: "Doctor",
    sentByName: "A. Ahmed, MD",
    status: "Accepted",
    date: "2025-11-03",
    urgent: true,
    hasAdditionalInfo: false,
    details: "Acute referral. Please assess and advise.",
  },
  {
    id: "ref-3",
    to: "Medical division",
    from: "Home care service",
    sentByRole: "Nurse",
    sentByName: "Ayaan Hassan, RN",
    status: "Unassessed",
    date: "Today",
    urgent: false,
    hasAdditionalInfo: false,
    details: "Home care referral for review.",
  },
];

/* ========================================================
 * ORDERS & RESULTS
 * ====================================================== */
export const MOCK_ORDERS: Order[] = [
  { id: "o1", category: "Chemistry", name: "B-EVF", orderedBy: "Medical ward 1", date: "2021-10-10", dateTime: "2021-10-10 14:03" },
  { id: "o2", category: "Chemistry", name: "B-HbA1c (IFCC)", orderedBy: "Medical ward 1", date: "2021-10-10" },
  { id: "o3", category: "Microbiology", name: "Urine culture", orderedBy: "Medical ward 1", date: "2021-10-18" },
  { id: "o4", category: "Radiology", name: "Abdominal ultrasound (overview)", orderedBy: "Medical ward 2", date: "2021-10-16" },
];

export const MOCK_ORDER_RESULTS: OrderResult[] = [
  {
    id: "r-o2-hba1c",
    orderId: "o2",
    status: "final",
    category: "Chemistry",
    name: "B-HbA1c (IFCC)",
    result: "61",
    date: "2025-10-15",
    flag: "high",
  },
  {
    id: "r-o1-bevf",
    orderId: "o1",
    status: "final",
    category: "Chemistry",
    name: "B-EVF",
    result: "Normal",
    date: "2025-10-15",
    flag: "normal",
  },
  {
    id: "r-extra-trig",
    orderId: "unlinked-trig",
    status: "final",
    category: "Chemistry",
    name: "fP-Triglycerides",
    result: "3.7",
    date: "2025-10-15",
    flag: "normal",
  },
  {
    id: "r-extra-alb",
    orderId: "unlinked-alb",
    status: "final",
    category: "Chemistry",
    name: "P-Albumin",
    result: "39",
    date: "2025-10-15",
    flag: "normal",
  },
  {
    id: "r-extra-k",
    orderId: "unlinked-k",
    status: "final",
    category: "Chemistry",
    name: "P-Potassium",
    result: "3.9",
    date: "2025-10-15",
    flag: "normal",
  },
];

/* ========================================================
 * FLUID BALANCE
 * ====================================================== */
const mkFluidDetails = (d: Partial<FluidBalanceDetails>): FluidBalanceDetails => ({
  measuredAt: d.measuredAt ?? "2026-01-08 20:14",
  oralMl: d.oralMl ?? 0,
  oralKcal: d.oralKcal ?? 0,
  enteralMl: d.enteralMl ?? 0,
  enteralKcal: d.enteralKcal ?? 0,
  bleedingMl: d.bleedingMl ?? 0,
  faecesMl: d.faecesMl ?? 0,
  vomitingMl: d.vomitingMl ?? 0,
  urineMl: d.urineMl ?? 0,
});

export const MOCK_FLUID_BALANCE: FluidBalanceEntry[] = [
  {
    id: "fb-yesterday",
    label: "Yesterday",
    period: "05:00–04:59",
    intakeMl: 2200,
    outputMl: 1500,
    balance: "+700 ml",
    details: mkFluidDetails({ measuredAt: "2026-01-07 20:14" }),
  },
  {
    id: "fb-today",
    label: "Today",
    period: "05:00–04:59",
    intakeMl: 2350,
    outputMl: 1300,
    balance: "+1 050 ml",
    details: mkFluidDetails({}),
  },
];

/* ========================================================
 * CLINICAL PARAMETERS & LOGS
 * ====================================================== */
export const MOCK_CLINICAL_LOGS: Record<
  ClinicalParameterName,
  ClinicalLogEntry[]
> = {
  NEWS2: [
    { dateTime: "2025-10-20 09:59", value: "7", enteredBy: "Johan Svärd" },
    { dateTime: "2025-10-21 10:01", value: "5", enteredBy: "Johan Svärd" },
    { dateTime: "2025-10-21 11:36", value: "6", enteredBy: "Johan Svärd" },
    { dateTime: "2025-10-21 13:46", value: "7", enteredBy: "Johan Svärd" },
    { dateTime: "2025-10-22 10:54", value: "6", enteredBy: "Johan Svärd" },
  ],
  AVPU: [{ dateTime: "2025-10-22 10:54", value: "Alert", enteredBy: "Johan Svärd" }],
  "Respiratory rate": [{ dateTime: "2025-10-22 10:54", value: "27", enteredBy: "Johan Svärd" }],
  "SpO₂": [{ dateTime: "2025-10-22 10:54", value: "95", enteredBy: "Johan Svärd", note: "0 L" }],
  Pulse: [{ dateTime: "2025-10-22 10:54", value: "92", enteredBy: "Johan Svärd" }],
  "Blood pressure": [{ dateTime: "2025-10-22 10:54", value: "136/89", enteredBy: "Johan Svärd" }],
  "Body temperature": [{ dateTime: "2025-10-22 10:54", value: "38.8", enteredBy: "Johan Svärd" }],
};

/* ========================================================
 * FORM OPTIONS
 * ====================================================== */
export const CONSCIOUSNESS_OPTIONS = [
  { value: "Alert", label: "Alert (A)" },
  { value: "Voice", label: "Responds to voice (V)" },
  { value: "Pain", label: "Responds to pain (P)" },
  { value: "Unresponsive", label: "Unresponsive (U)" },
  { value: "Confusion", label: "New confusion" },
];

/* ========================================================
 * MEDICATIONS
 * ====================================================== */
export const MOCK_MEDICATION_SECTIONS: MedicationSection[] = [
  {
    id: "currentMeds",
    title: "Current medication treatments",
    items: [
      {
        id: "amlodipine",
        product: "Amlodipine Accord",
        strength: "5 mg",
        dose: "1 tablet once daily",
        info: "Calcium channel blocker – used for hypertension and angina.",
      },
    ],
  },
  {
    id: "asNeeded",
    title: "As needed",
    items: [
      {
        id: "asaCaff",
        product: "Acetylsalicylic acid / Caffeine",
        strength: "500 mg / 50 mg",
        dose: "1 tablet as needed up to 3 times daily",
        info: "Combination analgesic for pain and headache.",
      },
      {
        id: "almotriptan",
        product: "Almotriptan Orifarm",
        strength: "12.5 mg",
        dose: "1 tablet as needed",
        info: "Triptan for acute migraine attacks.",
      },
      {
        id: "alvedonNovum",
        product: "Alvedon Novum",
        strength: "500 mg",
        dose: "2 tablets 4 times daily as needed",
        info: "Paracetamol – pain relief and antipyretic.",
      },
    ],
  },
  {
    id: "pausedMeds",
    title: "Paused medication treatments",
    items: [
      {
        id: "arthrotec",
        product: "Arthrotec",
        strength: "50 mg / 0.2 mg",
        dose: "1 tablet twice daily",
        info: "NSAID + gastroprotective for arthritis pain.",
      },
    ],
  },
  {
    id: "endedMeds",
    title: "Ended medication treatments",
    items: [],
  },
];

/* ========================================================
 * VACCINATIONS
 * ====================================================== */
export const MOCK_VACCINATION_SECTIONS: VaccinationSection[] = [
  {
    id: "currentVacc",
    title: "Current vaccinations",
    items: [
      {
        id: "influVac",
        product: "Influvac Tetra (influenza vaccine)",
        strength: "1 ml single dose",
        dose: "1 ml single dose",
        info: "Seasonal influenza protection.",
      },
      {
        id: "synflorix",
        product: "Synflorix (pneumococcal vaccine)",
        strength: "1 dose",
        dose: "1 dose single injection",
        info: "Protection against pneumococcal infections.",
      },
      {
        id: "vaxzevria",
        product: "Vaxzevria (COVID-19 vaccine)",
        strength: "0.5 ml single dose",
        dose: "0.5 ml single dose",
        info: "Protection against COVID-19.",
      },
    ],
  },
  { id: "prnVacc", title: "As needed vaccinations", items: [] },
  { id: "pausedVacc", title: "Paused vaccinations", items: [] },
  { id: "endedVacc", title: "Ended vaccinations", items: [] },
];

/* ========================================================
 * PATIENT CARE CONTACTS
 * ====================================================== */
export const MOCK_CARE_CONTACTS: CareContactEntry[] = [
  {
    id: "care-1",
    date: "2025-12-10",
    category: "outpatient",
    visitType: "Mottagningsbesök",
    unit: "Medicin avd 1",
    responsible: "Chatarine Stengärderos",
    role: "Läkare",
  },
  {
    id: "care-2",
    date: "2025-11-21",
    category: "inpatient",
    visitType: "Vårdtillfälle",
    unit: "Stroke ward",
    responsible: "Johan Svärd",
    role: "Läkare",
  },
];

/* ========================================================
 * ATTENTION SIGNALS
 * ====================================================== */
export const MOCK_ATTENTION_SIGNALS: AttentionSignalEntry[] = [
  {
    id: "att-1",
    category: "Hypersensitivity",
    title: "Latex",
    status: "active",
    assessedAt: "2022-09-29 10:50",
    assessedBy: "Högdal, Olof, MD",
    unit: "Medicine clinic",
    severity: "Harmful",
    certainty: "Confirmed",
    description: "Allergen: Latex",
    links: [{ label: "2022-09-29 Clinical note" }],
  },
  {
    id: "att-2",
    category: "Medical Condition and Treatment",
    title: "Warfarin therapy",
    status: "active",
    assessedAt: "2022-10-05 16:34",
    assessedBy: "Högdal, Olof, MD",
    unit: "Medicine ward 1",
    severity: "Moderate",
    certainty: "Confirmed",
    description: "Treatment: Warfarin therapy. Reason: Monitoring/testing.",
  },
  {
    id: "att-3",
    category: "Infection",
    title: "MRSA (meticillin-resistant Staphylococcus aureus)",
    status: "active",
    assessedAt: "2022-10-01 08:30",
    assessedBy: "Registered nurse",
    unit: "Medicine ward 1",
    certainty: "Confirmed",
    description: "Infection risk: MRSA. Follow standard precautions + contact isolation.",
  },
  {
    id: "att-4",
    category: "Non-routine Care Deviation",
    title: "Patient does not accept blood or plasma transfusion",
    status: "active",
    assessedAt: "2022-09-28 14:12",
    assessedBy: "Physician",
    unit: "Emergency department",
    certainty: "Confirmed",
    description: "Care deviation: Patient refuses blood/plasma transfusion.",
  },
  {
    id: "att-5",
    category: "Hypersensitivity",
    title: "Penicillin (suspected)",
    status: "ended",
    assessedAt: "2021-06-12 09:10",
    assessedBy: "Physician",
    unit: "Primary care clinic",
    certainty: "Suspected",
    description: "Reported past reaction, not verified.",
  },
  {
    id: "att-6",
    category: "Infection",
    title: "Influenza (incorrectly registered)",
    status: "cancelled",
    assessedAt: "2021-12-01 11:22",
    assessedBy: "Nurse",
    unit: "Medicine ward 2",
    description: "Annulled: entered in error.",
  },
];

/* ========================================================
 * ORDER UI CONFIG
 * ====================================================== */
export const ORDER_CATEGORY_PREFERENCE: string[] = [
  "Clinical parameters",
  "Chemistry",
  "Hematology",
  "Microbiology",
  "Radiology",
  "Endoscopy",
  "Tasks",
  "Other",
];

/* ========================================================
 * LAB RESULT UI CATALOG (TEMPORARY)
 * --------------------------------------------------------
 * Will later come from database / terminology service
 * ====================================================== */

export const LAB_CATALOG: Record<string, LabMeta> = {
  "P-CRP": { unit: "mg/L", ref: "0–5" },
  "B-Hemoglobin (Hb)": { unit: "g/L", ref: "120–150" },
  "B-HbA1c (IFCC)": { unit: "mmol/mol", ref: "27–42" },
  "P-Albumin": { unit: "g/L", ref: "36–45" },
  "P-Potassium": { unit: "mmol/L", ref: "3.5–5.0" },
};

export const LAB_ALIASES: Record<string, keyof typeof LAB_CATALOG> = {
  // "HbA1c (IFCC)": "B-HbA1c (IFCC)",
  // "P-K": "P-Potassium",
};
