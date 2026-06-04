import { z } from "zod";

export const createEncounterSchema = z.object({ 
  clinicId: z.uuid().optional(),
  patientId: z.uuid(),

  type: z.enum([
    "outpatient",
    "inpatient",
    "emergency",
    "telehealth",
  ]),

  reason: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export type CreateEncounterInput = z.infer<typeof createEncounterSchema>;
