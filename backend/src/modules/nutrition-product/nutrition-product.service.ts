// backend/src/modules/medication/nutrition-product/nutrition-product.service.ts

import * as repo from "./nutrition-product.repository.js";
import type { CreateNutritionProductInput } from "./nutrition-product.schema.js";

export const createNutritionProduct = async ( input: CreateNutritionProductInput ) => {
  return repo.createNutritionProduct(input);
};

export const listNutritionProducts = async ( patientId: string ) => {
  return repo.findByPatient(patientId);
};

export const updateNutritionProduct = async ( id: string, data: any ) => {
  return repo.updateNutritionProduct(id, data);
};

export const deleteNutritionProduct = async ( id: string ) => {
  return repo.deleteNutritionProduct(id);
};