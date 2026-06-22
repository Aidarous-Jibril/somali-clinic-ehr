// backend/src/modules/medication/nutrition-product/nutrition-product.schema.ts

import { z } from "zod";

export const createNutritionProductSchema = z.object({
  patientId: z.uuid({message: "Patient ID must be valid",}),
  productName: z.string().min(1, { message: "Product name is required",}),

  description: z.string().optional(),
  articleNo: z.string().optional(),
  productArea: z.string().optional(),

  prescribedAt: z.string().optional(),
  validUntil: z.string().optional(),
  prescriber: z.string().optional(),
});

export const updateNutritionProductSchema = z.object({
  productName: z.string().min(1).optional(),
  description: z.string().optional(),
  articleNo: z.string().optional(),
  productArea: z.string().optional(),
  prescribedAt: z.string().optional(),
  validUntil: z.string().optional(),
  prescriber: z.string().optional(),
  status: z.enum(["valid", "expired", "cancelled"]).optional(),
});

export type CreateNutritionProductInput = z.infer< typeof createNutritionProductSchema >;
export type UpdateNutritionProductInput = z.infer< typeof updateNutritionProductSchema >;