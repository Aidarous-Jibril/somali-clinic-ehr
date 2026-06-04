import { z } from "zod";

export const createVaccinationSchema = z.object({
  patientId: z.uuid(),
  encounterId: z.uuid().optional(),

  vaccineName: z.string().min(1),
  dose: z.string().optional(),
  manufacturer: z.string().optional(),
  batchNumber: z.string().optional(),
  
  administeredAt: z.coerce.date().optional(),
  notes: z.string().optional(),
});
