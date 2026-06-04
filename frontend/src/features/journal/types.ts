// src/features/journal/types.ts

export type JournalViewKey =
  | "unit_notes"
  | "care_plans"
  | "documents"
  | "all_notes"
  | "all_physician_notes";

export interface JournalViewItem {
  key: JournalViewKey;
  label: string;
}

export type NoteTypeKey =
  | "progress_note"
  | "admission_note";

export type NoteStatus =
  | "Draft"
  | "Signed"
  | "Voided";

export interface JournalNote {
  id: string;
  tableId: string;

  type: NoteTypeKey;
  title: string;

  dateTime: string;
  eventDateTime?: string;

  author: string;
  unit: string;

  status: NoteStatus;
  content: string;

  templateId?: string;
  encounterLabel?: string;
  staffLabel?: string;

  sectionValues?: Record<string, string>;

  voidedAt?: string;
  voidReason?: string;

  isPhysicianNote?: boolean;
  isUnitNote?: boolean;
}

export interface JournalTemplateSection {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
}

export interface JournalTemplate {
  id: string;
  label: string;
  noteType: NoteTypeKey;
  sections: JournalTemplateSection[];
}

export type JournalTableStatus =
  | "Open"
  | "Closed";

export type JournalCloseReasonKey =
  | "not_relevant"
  | "new_version"
  | "patient_discharged";

export interface JournalTable {
  id: string;
  title: string;

  createdAt: string;
  createdBy: string;

  unit: string;
  status: JournalTableStatus;

  closedAt?: string;
  closeReason?: JournalCloseReasonKey;
  closeComment?: string;
}

export type EditorMode =
  | "edit"
  | "read";