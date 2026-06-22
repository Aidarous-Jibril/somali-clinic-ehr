// fluidBalance.schema.ts
import { z } from "zod";

export const createFluidBalanceSchema = z.object({
  patientId: z.uuid(),
  encounterId: z.uuid().optional(),

  measuredAt: z.coerce.date({ message: "Measured date is required",}),
  label: z.string().min(1, { message: "Label is required", }),
  period: z.string().min(1, { message: "Period is required", }),
  oralMl: z.number().int().min(0, { message: "Oral fluid amount is required", }),
  oralKcal: z.number().int().min(0).optional(),

  enteralMl: z.number().int().min(0).optional(),
  enteralKcal: z.number().int().min(0).optional(),

  urineMl: z.number().int().min(0).optional(),
  bleedingMl: z.number().int().min(0).optional(),
  faecesMl: z.number().int().min(0).optional(),
  vomitingMl: z.number().int().min(0).optional(),
});


export const updateFluidBalanceSchema = z.object({
  measuredAt: z.coerce.date().optional(),
  label: z.string().optional(),
  period: z.string().optional(),

  oralMl: z.number().int().min(0).optional(),
  oralKcal: z.number().int().min(0).optional(),

  enteralMl: z.number().int().min(0).optional(),
  enteralKcal: z.number().int().min(0).optional(),

  urineMl: z.number().int().min(0).optional(),
  bleedingMl: z.number().int().min(0).optional(),
  faecesMl: z.number().int().min(0).optional(),
  vomitingMl: z.number().int().min(0).optional(),
});


export type CreateFluidBalanceInput = z.infer<typeof createFluidBalanceSchema>;
export type UpdateFluidBalanceInput = z.infer<typeof updateFluidBalanceSchema>;