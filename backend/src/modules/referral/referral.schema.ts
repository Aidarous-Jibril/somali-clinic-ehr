import { z } from "zod";

export const createReferralSchema = z.object({
  clinicId: z.uuid(),
  patientId: z.uuid(),
  encounterId: z.uuid().optional(),

  to: z.string().min(1),
  from: z.string().min(1),

  sentByRole: z.enum([
    "Doctor",
    "Nurse",
    "Physiotherapist",
    "OccupationalTherapist",
    "Dietitian",
    "SpeechTherapist",
    "Midwife",
    "Other",
  ]),

  sentByName: z.string().min(1),
  sentByUnit: z.string().optional(),

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
