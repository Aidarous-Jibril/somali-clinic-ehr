import { z } from "zod";

/* =========================
   CREATE SAMPLE
========================= */
export const createSampleSchema = z.object({
  orderId: z.uuid(),
  patientId: z.uuid(),

  sampleType: z.enum([
    "blood",
    "urine",
    "stool",
    "saliva",
    "tissue",
    "swab",
    "serum",
    "plasma",
    "csf",
    "biopsy",
    "other",
  ]),

  barcode: z.string().optional(),
  notes: z.string().optional(),
});

/* =========================
   COLLECT SAMPLE
========================= */
export const collectSampleSchema = z.object({
  notes: z.string().optional(),
});

/* =========================
   REJECT SAMPLE
========================= */
export const rejectSampleSchema = z.object({
  reason: z.string().min(1),
});

/* =========================
   TYPES
========================= */
export type CreateSampleInput = z.infer< typeof createSampleSchema >;

export type CollectSampleInput = z.infer< typeof collectSampleSchema >;

export type RejectSampleInput = z.infer< typeof rejectSampleSchema >;