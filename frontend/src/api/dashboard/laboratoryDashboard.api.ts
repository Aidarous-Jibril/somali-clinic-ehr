//src/api/dashboard/doctorDashboard.api.api.ts
import { api } from "../client";

export const getLabResultsByPatient = async (patientId: string) => {
  const res = await api.get(`/lab-results/patient/${patientId}`);
  return res.data;
};

export const getLabOrders = async () => {
  const { data } = await api.get( "/dashboard/laboratory/worklist");
  return data;
};

export const submitLabResult = async (
  orderId: string,
  payload: {
    value: string;
    unit?: string;
    flag: "normal" | "high" | "low" | "critical";
    comment?: string;
  }
) => {
  const { data } = await api.post(`/orders/${orderId}/result`, payload);
  return data;
};