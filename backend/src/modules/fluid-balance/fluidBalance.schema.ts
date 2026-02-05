// fluidBalance.schema.ts
import { z } from "zod";

export const createFluidBalanceSchema = z.object({
  patientId: z.uuid(),
  encounterId: z.uuid().optional(),

  measuredAt: z.coerce.date(),

  label: z.string(),
  period: z.string(),

  oralMl: z.number().int().min(0),
  oralKcal: z.number().int().min(0).optional(),

  enteralMl: z.number().int().min(0).optional(),
  enteralKcal: z.number().int().min(0).optional(),

  urineMl: z.number().int().min(0).optional(),
  bleedingMl: z.number().int().min(0).optional(),
  faecesMl: z.number().int().min(0).optional(),
  vomitingMl: z.number().int().min(0).optional(),
});

export type CreateFluidBalanceInput = z.infer<typeof createFluidBalanceSchema>;
