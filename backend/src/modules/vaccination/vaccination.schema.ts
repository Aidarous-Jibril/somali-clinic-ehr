import { z } from "zod";

export const createVaccinationSchema = z.object({
  patientId: z.uuid("Invalid patient ID format"),
  encounterId: z.uuid("Invalid encounter ID").optional(),
  vaccineName: z.string().min(1, "Vaccine name cannot be empty"),
  dose: z.string().optional(),
  manufacturer: z.string().optional(),
  batchNumber: z.string().optional(),
  administeredAt: z.coerce.date().optional(),
  notes: z.string().optional(),
});