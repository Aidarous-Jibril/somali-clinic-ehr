import { z } from "zod";

/* ==== CREATE ===== */
export const createOrderSchema = z.object({
  patientId: z.uuid({message: "Patient ID must be valid",}),
  encounterId: z.uuid({message: "Encounter ID must be valid",}),
  performerUnitId: z.uuid().optional(),
  category: z.enum([ "chemistry", "microbiology", "radiology", "procedure", ]),
  code: z.string().min(1, { message: "Order code is required", }),
  name: z.string().min(1, { message: "Order name is required", }),
});

/* ==== UPDATE ===== */
export const updateOrderSchema = z.object({
  category: z.enum([ "chemistry", "microbiology", "radiology", "procedure",]) .optional(),
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
});

export const resultOrderSchema = z.object({
  value: z.string().min(1, { message: "Result value is required", }),
  unit: z.string().optional(),
  flag: z.enum([ "normal", "high", "low", "critical",]),
  comment: z.string().optional(),
});


export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type ResultOrderInput = z.infer<typeof resultOrderSchema>;