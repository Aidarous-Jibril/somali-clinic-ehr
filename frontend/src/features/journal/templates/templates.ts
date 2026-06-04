// src/features/journal/templates/templates.ts

import type { JournalTemplate, JournalCloseReasonKey, JournalViewItem, } from "../types";

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: "tpl-sbar-nursing",
    label: "SBAR (Nursing)",
    noteType: "progress_note",
    sections: [
      {
        key: "situation",
        label: "Situation",
        placeholder: "What is happening right now?",
      },
      {
        key: "background",
        label: "Background",
        placeholder: "Relevant history / context",
      },
      {
        key: "assessment",
        label: "Assessment",
        placeholder: "Your assessment / findings",
      },
      {
        key: "recommendation",
        label: "Recommendation",
        placeholder: "What do you recommend?",
      },
    ],
  },

  {
    id: "tpl-sbar-physician",
    label: "SBAR (Physician)",
    noteType: "progress_note",
    sections: [
      {
        key: "situation",
        label: "Situation",
        placeholder: "Reason for review",
      },
      {
        key: "background",
        label: "Background",
        placeholder: "Pertinent history",
      },
      {
        key: "assessment",
        label: "Assessment",
        placeholder: "Clinical assessment",
      },
      {
        key: "recommendation",
        label: "Recommendation",
        placeholder: "Plan / orders / follow-up",
      },
    ],
  },

  {
    id: "tpl-admission",
    label: "Admission note",
    noteType: "admission_note",
    sections: [
      {
        key: "history",
        label: "History",
        placeholder: "Relevant history",
      },
      {
        key: "medications",
        label: "Medications",
        placeholder: "Current medications",
      },
      {
        key: "assessment",
        label: "Assessment",
        placeholder: "Clinical findings",
      },
      {
        key: "plan",
        label: "Plan",
        placeholder: "Treatment plan",
      },
    ],
  },
];


export const JOURNAL_VIEW_TREE: JournalViewItem[] = [
  { key: "unit_notes", label: "Unit notes" },
  { key: "care_plans", label: "Care plans" },
  { key: "documents", label: "Documents" },
  { key: "all_notes", label: "All notes" },
  { key: "all_physician_notes", label: "All physician notes", },
];

export const CLOSE_REASON_OPTIONS: {
  key: JournalCloseReasonKey;
  label: string;
}[] = [
  {
    key: "not_relevant",
    label: "No longer relevant",
  },
  {
    key: "new_version",
    label: "New version created",
  },
  {
    key: "patient_discharged",
    label: "Patient discharged",
  },
];