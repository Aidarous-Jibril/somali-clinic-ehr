import { z } from "zod";

export const createReferralSchema = z.object({
  patientId: z.uuid(),
  encounterId: z.uuid().optional(),

  toUnitId: z.uuid(),

  fromClinicId: z.uuid().optional(),
  fromUnitId: z.uuid().optional(),

  urgent: z.boolean().optional(),
  hasAdditionalInfo: z.boolean().optional(),
  details: z.string().optional(),
});


export const updateReferralStatusSchema = z.object({
  status: z.enum([
    "unassessed",
    "accepted",
    "in_progress",
    "completed",
  ]),
});

export type CreateReferralInput = z.infer<typeof createReferralSchema>;
