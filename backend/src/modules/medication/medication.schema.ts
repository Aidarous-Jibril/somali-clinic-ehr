import { z } from "zod";

export const createMedicationSchema = z.object({
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

    // Additional medication fields
  form: z.string().optional(),

  groupType: z.enum([
    "current",
    "prn",
    "notScheduled",
    "generalDirective",
  ]).optional(),

  dosingText: z.string().optional(),
  indication: z.string().optional(),

  route: z.enum([
    "oral",
    "intravenous",
    "intramuscular",
    "subcutaneous",
    "inhalation",
    "topical",
    "rectal",
    "ophthalmic",
    "otic",
    "nasal",
    "other",
  ]).optional(),

  notes: z.string().optional(),
});

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
