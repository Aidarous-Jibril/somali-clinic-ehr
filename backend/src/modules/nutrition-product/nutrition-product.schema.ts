// backend/src/modules/medication/nutrition-product/nutrition-product.schema.ts

import { z } from "zod";

export const createNutritionProductSchema = z.object({
  patientId: z.uuid(),

  productName: z.string().min(1),
  description: z.string().optional(),
  articleNo: z.string().optional(),
  productArea: z.string().optional(),

  prescribedAt: z.string().optional(),
  validUntil: z.string().optional(),
  prescriber: z.string().optional(),
});

export const updateNutritionProductSchema = createNutritionProductSchema.partial();

export type CreateNutritionProductInput = z.infer< typeof createNutritionProductSchema >;
