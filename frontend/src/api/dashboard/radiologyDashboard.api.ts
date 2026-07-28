// src/api/dashboard/radiology.api.ts
import { api } from "../client";

export const getRadiologyWorklist = async () => {
  const { data } = await api.get("/dashboard/radiology/worklist");
  return data;
}

export const getRadiologyResultsByPatient = async ( patientId: string ) => {
  console.log("patient ID", patientId)
  const { data } = await api.get( `/radiology/patient/${patientId}` );
  return data;
};

export const submitRadiologyReport = async ( orderId: string, payload: FormData ) => {
  const { data } = await api.post( `/radiology/orders/${orderId}/report`, payload );
  return data;
};

