import { z } from "zod";

export const createSampleSchema = z.object({

orderId: z.uuid({ message: "Order ID must be a valid UUID",}),

patientId: z.uuid({ message: "Patient ID must be a valid UUID", }),
  sampleType: z.enum([ "blood", "urine", "stool", "saliva", "tissue", "swab", "serum", "plasma", "csf", "biopsy", "other", ]),

  barcode: z.string().optional(),
  notes: z.string().optional(),
});


export const collectSampleSchema = z.object({
  notes: z.string().optional(),
});

export const rejectSampleSchema = z.object({
  reason: z.string().min(1),
});


export type CreateSampleInput = z.infer< typeof createSampleSchema >;

export type CollectSampleInput = z.infer< typeof collectSampleSchema >;

export type RejectSampleInput = z.infer< typeof rejectSampleSchema >;