import api from "./client";
import type {
  ConsentRecord,
  CreateConsentPayload,
  UpdateConsentStatusPayload,
} from "../features/consent/types";

export const getConsents = async ( patientId: string ): Promise<ConsentRecord[]> => {
  const { data } = await api.get(`/consents/patient/${patientId}`);
  return data;
};

export const createConsent = async ( payload: CreateConsentPayload ): Promise<ConsentRecord> => {
  const { data } = await api.post("/consents", payload);
  return data;
};

export const updateConsentStatus = async ( id: string, payload: UpdateConsentStatusPayload ) => {
  const { data } = await api.patch( `/consents/${id}/status`, payload);
  return data;
};