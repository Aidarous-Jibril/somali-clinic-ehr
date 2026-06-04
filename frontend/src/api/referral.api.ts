//src/api/referral.api.ts
import { api } from "./client";

export const getReferralsByPatient = async (patientId: string) => {
  const res = await api.get(`/referrals/patient/${patientId}`);
  return res.data;
};

export const createReferral = async (payload: any) => {
  const res = await api.post(`/referrals`, payload);
  return res.data;
};

export const updateReferralStatus = async ({ id, status, unitId, }: { id: string; status: string; unitId: string; }) => {
  const res = await api.patch( `/referrals/${id}/status`, { status }, { headers: { "x-unit-id": unitId, },});
  return res.data;
};

export const getIncomingReferrals = async () => {
  const res = await api.get("/referrals/incoming");
  return res.data;
};

export const getOutgoingReferrals = async () => {
  const res = await api.get("/referrals/outgoing");
  return res.data;
};