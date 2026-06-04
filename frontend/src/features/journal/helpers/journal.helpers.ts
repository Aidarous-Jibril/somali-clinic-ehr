// src/features/journal/helpers/journal.helpers.ts
import { toast } from "react-toastify";

import { JOURNAL_TEMPLATES } from "../templates/templates";
import type { JournalNote } from "../types";

/* ------------- Build structured note content from selected template --------------- */
export function buildJournalContent(note: JournalNote) {
  const template = note.templateId
    ? JOURNAL_TEMPLATES.find((item) => item.id === note.templateId)
    : undefined;

  if (!template) return note.content ?? "";

  return template.sections
    .map((section) => {
      const value = note.sectionValues?.[section.key] ?? "";
      return value ? `${section.label}:\n${value}` : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function validateJournalNote(note: JournalNote) {
  if (!note.encounterLabel?.trim()) {
    toast.error("Please select encounter.");
    return false;
  }

  if (!note.author?.trim()) {
    toast.error("Please select staff.");
    return false;
  }

  if (!note.unit?.trim()) {
    toast.error("Please select unit.");
    return false;
  }

  return true;
}