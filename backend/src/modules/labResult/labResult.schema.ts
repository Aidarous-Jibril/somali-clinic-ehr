import { z } from "zod";

export const createLabResultSchema = z.object({
  clinicId: z.uuid(),
  patientId: z.uuid(),
  orderId: z.uuid(),

  value: z.string().min(1),
  unit: z.string().optional(),

  flag: z.enum(["normal", "high", "low", "critical"]),

  resultDate: z.coerce.date().optional(),
});

export type CreateLabResultInput = z.infer<typeof createLabResultSchema>;
