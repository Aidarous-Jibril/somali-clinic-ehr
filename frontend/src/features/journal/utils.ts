// src/features/journal/utils.ts
import type { JournalNote, JournalViewKey } from "./types";

export function filterNotesByView(notes: JournalNote[], view: JournalViewKey) {
  switch (view) {
    case "unit_notes":
      return notes.filter((n) => n.isUnitNote);
    case "care_plans":
      return notes.filter((n) => n.type === "nursing_care_plan");
    case "encounters":
      return notes.filter((n) => n.type === "visit" || n.type === "admission_note");
    case "documents":
      return notes.filter((n) => n.type === "sick_leave_certificate");
    case "all_physician_notes":
      return notes.filter((n) => n.isPhysicianNote);
    case "keyword_view":
    case "record_references":
    case "care_assignments":
    case "all_notes":
    default:
      return notes;
  }
}

export function matchesSearch(note: JournalNote, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    note.title.toLowerCase().includes(q) ||
    note.author.toLowerCase().includes(q) ||
    note.unit.toLowerCase().includes(q) ||
    note.content.toLowerCase().includes(q)
  );
}
