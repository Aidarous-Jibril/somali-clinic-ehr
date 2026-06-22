import { z } from "zod";

export const createLabResultSchema = z.object({
  patientId: z.uuid({message: "Patient ID must be valid",}),
  orderId: z.uuid({ message: "Order ID must be valid", }),
  value: z.string().min(1, { message: "Result value is required",}),
  unit: z.string().optional(),

  flag: z.enum( ["normal", "high", "low", "critical"], { message: "Result flag is required", }),

  resultDate: z.coerce.date().optional(),
});

export type CreateLabResultInput = z.infer<typeof createLabResultSchema>;

