// src/api/medication.api.ts
import type { NutritionProductRecord } from "../features/medications/types";
import type { MedicationFormValues } from "../schemas/medication.schema";
import type { NutritionProductFormValues } from "../schemas/nutrition-product.schema";
import { api } from "./client";

// MEDICATIONS
export const getMedicationsByPatient = async (patientId: string) => {
  const { data } = await api.get(`/medications/patient/${patientId}`);
  return data;
};

export const createMedication = async (payload: MedicationFormValues) => {
  const { data } = await api.post("/medications", payload);
  return data;
};

export const pauseMedication = async (id: string) => {
  const { data } = await api.patch(`/medications/${id}/pause`);
  return data;
};

export const stopMedication = async (id: string) => {
  const { data } = await api.patch(`/medications/${id}/stop`);
  return data;
};

export const resumeMedication = async (id: string) => {
  const { data } = await api.patch(`/medications/${id}/resume`);
  return data;
};

// DOSES
export const createDose = async (medicationId: string, payload: any) => {
  const { data } = await api.post(`/medications/${medicationId}/doses`, payload);
  return data;
};

export const prepareDose = async (doseId: string) => {
  const { data } = await api.patch(`/medication-doses/${doseId}/prepare`);
  return data;
};

export const administerDose = async (doseId: string, payload: any) => {
  const { data } = await api.patch( `/medication-doses/${doseId}/administer`, payload);
  return data;
};

export const selfAdministerDose = async (doseId: string) => {
  const { data } = await api.patch( `/medication-doses/${doseId}/self-administer` );
  return data;
};

export const skipDose = async (doseId: string, payload: any) => {
  const { data } = await api.patch(`/medication-doses/${doseId}/skip`, payload);
  return data;
};

// ADMINISTRATIONS (MAR)
export const getAdministrations = async (medicationId: string) => {
  const { data } = await api.get(`/medications/${medicationId}/administrations`);
  return data;
};



export const getNutritionProductsByPatient = async ( patientId: string ): Promise<NutritionProductRecord[]> => {
  const { data } = await api.get( `/nutrition-products/patient/${patientId}` );

  return data.map((item: any) => ({
    id: item.id,
    prescribedDate: item.prescribedAt?.slice(0, 10) ?? "",
    product: item.productName,
    description: item.description ?? "",
    articleNumber: item.articleNo ?? "",
    productArea: item.productArea ?? "",
    validUntil: item.validUntil?.slice(0, 10) ?? "",
    prescriber: item.prescriber ?? "",
    status: item.status,
  }));
};

export const createNutritionProduct = async ( payload: NutritionProductFormValues ) => {
  const { data } = await api.post("/nutrition-products", payload);
  return data;
};

export const getMedicationFavorites = async () => {
  const response = await api.get("/medications/favorites");
  return response.data;
};