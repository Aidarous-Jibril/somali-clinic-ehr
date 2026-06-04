//src/api/sampling.api.ts
import { api } from "./client";

export const getSamplingWorklist = async () => {
  const response = await api.get("/samples");
  return response.data;
};

export const collectSample = async ( sampleId: string, notes?: string ) => {
  const response = await api.post( `/samples/${sampleId}/collect`, { notes } );

  return response.data;
};

export const receiveSample = async ( sampleId: string ) => {
  const response = await api.post( `/samples/${sampleId}/receive`);

  return response.data;
};

export const processSample = async ( sampleId: string ) => {
  const response = await api.post( `/samples/${sampleId}/process`);

  return response.data;
};

export const completeSample = async ( sampleId: string ) => {
    const response = await api.post( `/samples/${sampleId}/complete`);

  return response.data;
};