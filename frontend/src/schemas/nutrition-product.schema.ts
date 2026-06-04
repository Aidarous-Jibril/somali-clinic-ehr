import { z } from "zod";
import {
  uuidSchema,
  optionalText,
  requiredText,
} from "./common.schema";

export const nutritionProductFormSchema = z.object({
  patientId: uuidSchema,
  encounterId: optionalText,

  productName: requiredText("Product name is required"),
  description: optionalText,
  articleNo: optionalText,
  productArea: optionalText,

  prescribedAt: optionalText,
  validUntil: optionalText,
  prescriber: optionalText,
});

export type NutritionProductFormValues = z.infer< typeof nutritionProductFormSchema >;