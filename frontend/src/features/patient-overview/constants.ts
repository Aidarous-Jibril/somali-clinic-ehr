// // src/features/patient-overview/constants.ts
import type { AttentionSignalEntry, LabMeta } from "./types";

export const ORDER_CATEGORY_PREFERENCE: string[] = [
  "Chemistry",
  "Hematology",
  "Microbiology",
  "Radiology",
  "Other",
] as const;

//  FORM OPTIONS
export const CONSCIOUSNESS_OPTIONS = [
  { value: "Alert", label: "Alert (A)" },
  { value: "Voice", label: "Responds to voice (V)" },
  { value: "Pain", label: "Responds to pain (P)" },
  { value: "Unresponsive", label: "Unresponsive (U)" },
  { value: "Confusion", label: "New confusion" },
];


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