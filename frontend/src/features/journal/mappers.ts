// src/features/journal/mappers.ts
import type { JournalNote, JournalTable } from "./types";

/* ---------------- TABLE ---------------- */
export function mapTableFromApi(row: any): JournalTable {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.createdAt,
    createdBy: row.closedByStaffId ?? "System",
    unit: row.unit,

    status: row.status === "open" ? "Open" : "Closed",

    closedAt: row.closedAt ?? undefined,
    closeReason: row.closeReason ?? undefined,
    closeComment: row.closeComment ?? undefined,
  };
}

/* ---------------- NOTE ---------------- */
export function mapNoteFromApi(row: any): JournalNote {
  const statusMap = {
    draft: "Draft",
    signed: "Signed",
    voided: "Voided",
  } as const;

  return {
    id: row.id,
    tableId: row.tableId,

    type: "progress_note",
    title: row.title,

    dateTime: row.eventDateTime,
    eventDateTime: row.eventDateTime,

    author: row.authorName,
    unit: row.unit,

    status: statusMap[row.status as keyof typeof statusMap] ?? "Draft",

    content: row.content ?? "",

    templateId: row.templateId ?? undefined,

    sectionValues:
      row.sectionValues && typeof row.sectionValues === "object"
        ? row.sectionValues
        : undefined,

    voidedAt: row.voidedAt ?? undefined,
    voidReason: row.voidReason ?? undefined,

    isUnitNote: true,
    isPhysicianNote: true,
  };
}