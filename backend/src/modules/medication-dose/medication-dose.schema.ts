import { z } from "zod";

export const createMedicationDoseSchema = z.object({
  scheduledDate: z.coerce.date(),
  label: z.string().min(1),
  tooltip: z.string().optional(),
  isPrn: z.boolean().optional().default(false),
});

export type CreateMedicationDoseInput = z.infer< typeof createMedicationDoseSchema >;

export const administerDoseSchema = z.object({
  administeredDose: z.string().optional(),
  batchNumber: z.string().optional(),
  comment: z.string().optional(),
});

export type AdministerDoseInput = z.infer<typeof administerDoseSchema>;

export const skipDoseSchema = z.object({
  reason: z.string().optional(),
  comment: z.string().optional(),
});

export type SkipDoseInput = z.infer<typeof skipDoseSchema>;