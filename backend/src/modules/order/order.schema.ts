import { z } from "zod";

/* ==== CREATE ===== */
export const createOrderSchema = z.object({
  patientId: z.uuid(),
  encounterId: z.uuid(),
  performerUnitId: z.uuid().optional(),
  category: z.enum([ "chemistry", "microbiology", "radiology", "procedure", ]),
  code: z.string().min(1),
  name: z.string().min(1),
});

/* ==== UPDATE ===== */
export const updateOrderSchema = z.object({
  category: z.enum([ "chemistry", "microbiology", "radiology", "procedure",]) .optional(),
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  orderedBy: z.string().min(1).optional(),

  status: z
  .enum([ "ordered", "in_progress", "resulted", "reviewed", "completed", "cancelled", ]).optional(),
});

export const resultOrderSchema = z.object({
  value: z.string().min(1),
  unit: z.string().optional(),
  flag: z.enum([ "normal", "high", "low", "critical",]),
  comment: z.string().optional(),
});


export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type ResultOrderInput = z.infer<typeof resultOrderSchema>;