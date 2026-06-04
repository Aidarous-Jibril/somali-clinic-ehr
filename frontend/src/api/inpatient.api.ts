// src/api/inpatient.api.ts

import api from "./client";

import type {
  AdmitPatientPayload,
  ChangeBedPayload,
  CoordinationPayload,
  Inpatient,
  PatientLogEntry,
  PlanTransferPayload,
  ReserveBedPayload,
  SavePlannedDischargePayload,
  Transfer,
  TransferNowPayload,
} from "../features/unit-overview/types";

// ------------------------------------------------------
// Active contacts
// ------------------------------------------------------
export const getActiveContacts = async ( clinicId: string ): Promise<Inpatient[]> => {
  const { data } = await api.get("/inpatients/active", {
    params: { clinicId },
  });

  return data;
};

export const admitPatient = async ( payload: AdmitPatientPayload ) => {
  const { data } = await api.post("/inpatients/admit", payload);
  return data;
};

export const endCareContact = async (stayId: string) => {
  const { data } = await api.patch( "/inpatients/end-care-contact", { stayId } );
  return data;
};

// ------------------------------------------------------
// Bed / discharge
// ------------------------------------------------------
export const savePlannedDischarge = async ( payload: SavePlannedDischargePayload ) => {
  const { data } = await api.patch( "/inpatients/planned-discharge",payload );
  return data;
};

export const changeBed = async ( payload: ChangeBedPayload ) => {
  const { data } = await api.patch( "/inpatients/change-bed", payload);
  return data;
};

// ------------------------------------------------------
// Patient details
// ------------------------------------------------------
export const getPatientLog = async ( stayId: string ): Promise<PatientLogEntry[]> => {
  const { data } = await api.get(`/inpatients/${stayId}/log`);
  return data;
};

export const getCoordination = async (stayId: string) => {
  const { data } = await api.get( `/inpatients/${stayId}/coordination` );
  return data;
};

export const saveCoordination = async ( payload: CoordinationPayload ) => {
  const { data } = await api.put( "/inpatients/coordination", payload);

  return data;
};

// ------------------------------------------------------
// Transfers
// ------------------------------------------------------

export const planTransfer = async ( payload: PlanTransferPayload ) => {
  const { data } = await api.post( "/inpatients/plan-transfer", payload);
  return data;
};

export const getTransfers = async ( clinicId: string, unitId?: string ): Promise<Transfer[]> => {
  const { data } = await api.get( "/inpatients/transfers",{ params: { clinicId, unitId } } );
  return data;
};

export const reserveTransferBed = async ( payload: ReserveBedPayload ) => {
  const { data } = await api.patch( "/inpatients/transfers/reserve-bed", payload );
  return data;
};

export const transferNow = async ( payload: TransferNowPayload ) => {
  const { data } = await api.post( "/inpatients/transfers/transfer-now", payload );
  return data;
};