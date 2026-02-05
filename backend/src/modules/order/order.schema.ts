import { z } from "zod";

export const createOrderSchema = z.object({
  clinicId: z.uuid(),
  patientId: z.uuid(),
  encounterId: z.uuid(),

  category: z.enum([
    "chemistry",
    "microbiology",
    "radiology",
    "procedure",
  ]),

  code: z.string().min(1),
  name: z.string().min(1),

  orderedBy: z.string().min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
