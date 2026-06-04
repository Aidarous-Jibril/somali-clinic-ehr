import { z } from "zod";

export const createPatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["male", "female", "other", "unknown"]),
  dateOfBirth: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  nationalId: z.string().optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
