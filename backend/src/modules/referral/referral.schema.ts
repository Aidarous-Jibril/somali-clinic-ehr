import { z } from "zod";

export const createReferralSchema = z.object({
  patientId: z.uuid({ message: "Patient ID must be valid", }),
  encounterId: z.uuid().optional(),
  toUnitId: z.uuid({ message: "Target unit ID must be valid", }),

  fromClinicId: z.uuid().optional(),
  fromUnitId: z.uuid().optional(),

  urgent: z.boolean().optional(),
  hasAdditionalInfo: z.boolean().optional(),
  details: z.string().optional(),
});


export const updateReferralStatusSchema = z.object({
  status: z.enum([ "unassessed", "accepted", "in_progress", "completed", ]),
});

export type CreateReferralInput = z.infer<typeof createReferralSchema>;
