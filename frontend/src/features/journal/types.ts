/* ============================================================================
 * Journal – View & Navigation
 * ========================================================================== */

/**
 * Keys used by the journal view tree (left sidebar).
 * Controls how notes are grouped and filtered.
 */
export type JournalViewKey =
  | "keyword_view"
  | "unit_notes"
  | "record_references"
  | "care_plans"
  | "encounters"
  | "documents"
  | "care_assignments"
  | "all_notes"
  | "all_physician_notes";

/** One entry in the journal view tree */
export interface JournalViewItem {
  key: JournalViewKey;
  label: string;
}

/* ============================================================================
 * Journal – Notes
 * ========================================================================== */

/**
 * Supported journal note types (Cosmic-like).
 * Used for filtering, templates, and business rules.
 */
export type NoteTypeKey =
  | "progress_note"
  | "nursing_care_plan"
  | "admission_note"
  | "visit"
  | "sick_leave_certificate";

/** Lifecycle status of a journal note */
export type NoteStatus = "Draft" | "Signed" | "Voided";

/**
 * Core journal note entity.
 * Represents a single documentation entry.
 */
export interface JournalNote {
  id: string;
  type: NoteTypeKey;
  title: string;

  /** Last updated timestamp (ISO string) */
  dateTime: string;

  author: string;
  unit: string;
  status: NoteStatus;

  /** Owning journal table (journaltabell) */
  tableId: string;

  /** Rendered content shown in reading view */
  content: string;

  /* ---- View flags (used for filtering) ---- */
  isPhysicianNote?: boolean;
  isUnitNote?: boolean;

  /* ---- Editor & template metadata ---- */
  templateId?: string;
  encounterLabel?: string;
  staffLabel?: string;
  eventDateTime?: string; // ISO
  sectionValues?: Record<string, string>;

  /* ---- Voiding (makulering) metadata ---- */
  voidedAt?: string;     // ISO timestamp
  voidReason?: string;   // Free-text reason
}

/* ============================================================================
 * Journal – Templates
 * ========================================================================== */

/** One section within a journal template */
export interface JournalTemplateSection {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
}

/**
 * Journal template definition.
 * Used to generate structured notes (e.g. SBAR).
 */
export interface JournalTemplate {
  id: string;
  label: string;
  noteType: NoteTypeKey;
  sections: JournalTemplateSection[];
}

/* ============================================================================
 * Journal – Table lifecycle (Journaltabell)
 * ========================================================================== */

/** Journal table state */
export type JournalTableStatus = "Open" | "Closed";

/** Allowed reasons for closing a journal table */
export type JournalCloseReasonKey =
  | "not_relevant"
  | "new_version"
  | "patient_discharged";

/**
 * Journal table entity.
 * Groups notes under a specific care period/context.
 */
export interface JournalTable {
  id: string;
  title: string;        // e.g. "Inpatient care journal table"
  createdAt: string;    // ISO
  createdBy: string;
  unit: string;

  status: JournalTableStatus;

  /* ---- Closure metadata ---- */
  closedAt?: string;    // ISO
  closeReason?: JournalCloseReasonKey;
  closeComment?: string;
}

/* ============================================================================
 * Journal – Editor
 * ========================================================================== */

/** Editor mode used by note dialogs */
export type EditorMode = "edit" | "read";
