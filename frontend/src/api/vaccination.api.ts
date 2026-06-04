// src/api/vaccination.api.ts

import { api } from "./client";
import type { RegisterVaccinationInput, VaccinationRecord,  } from "../features/medications/types";

/* ============================================================================
 * API Functions
 * ========================================================================== */
export const createVaccination = async (payload: RegisterVaccinationInput ): Promise<VaccinationRecord> => {
  const { data } = await api.post("/vaccinations", payload);
  return data;
};

export const getVaccinationsByPatient = async ( patientId: string ): Promise<VaccinationRecord[]> => {
  const { data } = await api.get( `/vaccinations/patient/${patientId}` );
  return data;
};


export const declineVaccination = async ( id: string ): Promise<VaccinationRecord> => {
  const { data } = await api.patch( `/vaccinations/${id}/decline`);
  return data;
};


export const completeVaccination = async ( id: string ): Promise<VaccinationRecord> => {
  const { data } = await api.patch( `/vaccinations/${id}/complete`);
  return data;
};