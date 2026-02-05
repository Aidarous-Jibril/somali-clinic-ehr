import type { JournalNote, JournalTable, JournalViewItem } from "./types";

/* ============================================================================
 * Journal – View tree (left sidebar navigation)
 * ========================================================================== */

/**
 * Static definition of the journal view tree.
 * Controls how notes are grouped and filtered in the UI.
 */
export const JOURNAL_VIEW_TREE: JournalViewItem[] = [
  { key: "unit_notes", label: "Unit notes" },
  { key: "care_plans", label: "Care plans" },
  { key: "documents", label: "Documents" },
  { key: "all_notes", label: "All notes" },
  { key: "all_physician_notes", label: "All physician notes" },
];

/* ============================================================================
 * Journal – Editor dropdown options (mock data)
 * ========================================================================== */

/**
 * Encounter options shown in the note editor.
 * Later replaced by encounters fetched from backend.
 */
export const ENCOUNTER_OPTIONS = [
  "2025-12-18 • Orthopedics outpatient",
  "2025-12-18 • Orthopedics Ward 1",
  "2025-12-19 • Emergency visit",
] as const;

/** Staff options used in editor dropdowns */
export const STAFF_OPTIONS = [
  "A. Ahmed, MD",
  "Hugo Halvarsson, RN",
  "Herbert Kurz, PT",
] as const;

/** Unit options used in editor dropdowns */
export const UNIT_OPTIONS = [
  "Orthopedics outpatient",
  "Orthopedics Ward 1",
  "Emergency department",
] as const;

/* ============================================================================
 * Journal – Table lifecycle helpers
 * ========================================================================== */

/**
 * Human-readable labels for journal table close reasons.
 * Used in dialogs and table status display.
 */
export const CLOSE_REASON_OPTIONS: {
  key: "not_relevant" | "new_version" | "patient_discharged";
  label: string;
}[] = [
  { key: "not_relevant", label: "Ej längre aktuell" },
  { key: "new_version", label: "Ny utgåva" },
  { key: "patient_discharged", label: "Patient utskriven" },
];

/* ============================================================================
 * Journal – Initial journal tables (mock)
 * ========================================================================== */

/**
 * Mock journal tables (journaltabeller).
 * Represents care periods / documentation contexts.
 */
export const initialJournalTables: JournalTable[] = [
  {
    id: "jt-1",
    title: "Inpatient care journal table",
    createdAt: "2025-12-18T08:00:00Z",
    createdBy: "A. Ahmed, MD",
    unit: "Orthopedics Ward 1",
    status: "Open",
  },
  {
    id: "jt-2",
    title: "Inpatient care journal table",
    createdAt: "2025-12-01T09:00:00Z",
    createdBy: "Herbert Kurz, PT",
    unit: "Orthopedics Ward 1",
    status: "Closed",
    closedAt: "2025-12-10T10:15:00Z",
    closeReason: "patient_discharged",
    closeComment: "",
  },
];

/* ============================================================================
 * Journal – Initial journal notes (mock)
 * ========================================================================== */

/**
 * Mock journal notes linked to journal tables.
 * Covers signed, physician, unit, and draft notes.
 */
export const initialJournalNotes: JournalNote[] = [
  {
    id: "note-1",
    tableId: "jt-1",
    type: "progress_note",
    title: "Progress note",
    dateTime: "2025-12-18T08:24:00Z",
    author: "Herbert Kurz, PT",
    unit: "Orthopedics Ward 1",
    status: "Signed",
    content:
      "Planned review of training program after knee surgery. Verbal and written rehabilitation information provided.",
    isUnitNote: true,
    isPhysicianNote: false,
  },
  {
    id: "note-2",
    tableId: "jt-1",
    type: "admission_note",
    title: "Admission note",
    dateTime: "2025-12-18T08:24:00Z",
    author: "A. Ahmed, MD",
    unit: "Orthopedics Ward 1",
    status: "Signed",
    content:
      "Admitted for elective procedure. History reviewed. Plan discussed with patient.",
    isUnitNote: true,
    isPhysicianNote: true,
  },

  /**
   * Draft note used to test:
   * - editor flow
   * - signing
   * - voiding & deleting
   */
  {
    id: "note-3",
    tableId: "jt-1",
    type: "progress_note",
    title: "SBAR (Nursing)",
    dateTime: "2026-01-15T09:56:24Z",
    author: "Current user",
    unit: "Orthopedics Ward 1",
    status: "Draft",
    content:
      "Situation:\nI'm calling about...\n\nBackground:\n...\n\nAssessment:\n...\n\nRecommendation:\n...",
    isUnitNote: true,
    isPhysicianNote: false,
  },
];
