import { z } from "zod";

export const createJournalTableSchema = z.object({
  patientId: z.uuid(),
  encounterId: z.uuid().optional().nullable(),
  title: z.string().min(2),
  unit: z.string().min(2),
});

export const createJournalNoteSchema = z.object({
  tableId: z.uuid(),
  patientId: z.uuid(),
  title: z.string().min(2),
  content: z.string(),
  unit: z.string(),
});

export const closeJournalTableSchema = z.object({
  reason: z.string().min(1),
  comment: z.string().optional().nullable(),
});