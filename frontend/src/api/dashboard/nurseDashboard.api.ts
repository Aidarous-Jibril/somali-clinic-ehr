import { api } from "../client";

export const getAssignedPatients = async () => {
  const { data } = await api.get( "/dashboard/nurse/assigned-patients" );
  return data;
};

export const getMedicationDuePatients = async () => {
  const { data } = await api.get( "/dashboard/nurse/medication-due" );
  return data;
};

export const getVitalsOverduePatients = async () => {
  const { data } = await api.get( "/dashboard/nurse/vitals-overdue" );
  return data;
};

export const getFluidAlertPatients = async () => {
  const { data } = await api.get( "/dashboard/nurse/fluid-alerts" );
  return data;
};

export const getPendingReferralPatients = async () => {
  const { data } = await api.get( "/dashboard/nurse/pending-referrals" );
  return data;
};

export const getWardOccupancy = async () => {
  const { data } = await api.get( "/dashboard/nurse/ward-occupancy" );
  return data;
};