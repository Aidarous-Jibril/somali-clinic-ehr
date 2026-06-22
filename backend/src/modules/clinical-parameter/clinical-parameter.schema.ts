import { z } from "zod";

export const createClinicalParameterSchema = z.object({
  encounterId: z.uuid({ message: "Encounter ID must be valid",}),
  name: z.enum([ "NEWS2", "respiratory_rate", "spo2", "pulse", "blood_pressure", "temperature", "consciousness", ]),
  value: z.string().min(1),
  note: z.string().optional(),
});

export type CreateClinicalParameterInput = z.infer<typeof createClinicalParameterSchema>;
