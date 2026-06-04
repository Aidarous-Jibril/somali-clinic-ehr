// src/api/patient.api.ts

import type { CreatePatientPayload, Patient, UpdateOrderPayload } from "../features/patient/types";
import { api } from "./client";


/* ---------------------------------- */
/* Patients                           */
/* ---------------------------------- */

export const getPatitent = async ( patientId: string ): Promise<Patient> => {
  const { data } = await api.get( `/patients/${patientId}`);
  return data;
};

export const fetchPatients = async (): Promise< Patient[]> => {
  const { data } = await api.get("/patients");
  return data;
};

export const searchPatients = async ( q: string ): Promise<Patient[]> => {
  const { data } = await api.get( "/patients/search", { params: { q }, } );
  return data;
};

export const createPatient = async ( payload: CreatePatientPayload ): Promise<Patient> => {
  const { data } = await api.post( "/patients", payload);
  return data;
};

/* ---------------------------------- */
/* Orders                             */
/* ---------------------------------- */

export const createOrder = async (
  payload: {
    patientId: string;
    encounterId: string;
    category: string;
    code: string;
    name: string;
  }
) => {
  const { data } = await api.post( "/orders", payload );
  return data;
};

export const updateOrder = async ( id: string, payload: UpdateOrderPayload ) => {
  const { data } = await api.patch( `/orders/${id}`, payload );
  return data;
};