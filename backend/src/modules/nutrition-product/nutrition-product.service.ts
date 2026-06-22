// backend/src/modules/medication/nutrition-product/nutrition-product.service.ts

import * as repo from "./nutrition-product.repository.js";
import type { CreateNutritionProductInput } from "./nutrition-product.schema.js";

export const createNutritionProduct = async ( input: CreateNutritionProductInput, user?: any ) => {
  const patient = await repo.findPatientById(input.patientId);

  if (!patient) throw new Error("Patient not found");

  if ( user?.role !== "SuperAdmin" && patient.clinicId !== user.clinicId ) 
    throw new Error( "You can only create nutrition products for your own clinic" );

  return repo.createNutritionProduct(input);
};

export const listNutritionProducts = async ( patientId: string, user?: any) => {
  const patient = await repo.findPatientById(patientId);

  if (!patient) throw new Error("Patient not found");

  if (user?.role !== "SuperAdmin" && patient.clinicId !== user.clinicId) 
    throw new Error("You can only view nutrition products from your own clinic");

  return repo.findByPatient(patientId);
};

export const updateNutritionProduct = async ( id: string, data: any, user?: any ) => {
  const product = await repo.findById(id);

  if (!product)  throw new Error("Nutrition product not found");

  const patient = await repo.findPatientById(product.patientId);

  if ( user?.role !== "SuperAdmin" && patient?.clinicId !== user.clinicId ) 
    throw new Error( "You can only update nutrition products from your own clinic" );

  return repo.updateNutritionProduct(id, data);
};

export const deleteNutritionProduct = async ( id: string, user?: any) => {
  const product = await repo.findById(id);

  if (!product) throw new Error("Nutrition product not found");

  const patient = await repo.findPatientById(product.patientId);

  if ( user?.role !== "SuperAdmin" && patient?.clinicId !== user.clinicId ) 
    throw new Error( "You can only delete nutrition products from your own clinic");

  return repo.deleteNutritionProduct(id);
};