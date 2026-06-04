//src/api/clinical.api.ts
import { api } from "./client";

export const getClinicalByEncounter = async (encounterId: string) => {
  const res = await api.get(`/clinical-parameters/encounter/${encounterId}`);
  return res.data;
};

export const createClinicalEntry = async (payload: any) => {
  const res = await api.post(`/clinical-parameters`, payload);
  return res.data;
};

