import { z } from "zod";

export const createMedicationSchema = z.object({
  clinicId: z.uuid(),
  patientId: z.uuid(),
  encounterId: z.uuid().optional(),

  name: z.string().min(1),
  strength: z.string().optional(),
  dose: z.string().min(1),

  frequency: z.enum([
    "once_daily",
    "twice_daily",
    "three_times_daily",
    "four_times_daily",
    "as_needed",
  ]),

  notes: z.string().optional(),
});

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
