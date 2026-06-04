import client from "./client";

export const getFluidBalanceByPatient = (patientId: string) => client.get(`/fluid-balance/patient/${patientId}`);

export const createFluidBalance = (data: any) => client.post(`/fluid-balance`, data);