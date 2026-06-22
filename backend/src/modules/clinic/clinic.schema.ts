import { z } from "zod";

export const createClinicSchema = z.object({
  name: z.string().min(1, { message: "Clinic name is required", }),
  code: z.string().min(1, { message: "Clinic code is required",}),
});

export type CreateClinicInput = z.infer<typeof createClinicSchema>;