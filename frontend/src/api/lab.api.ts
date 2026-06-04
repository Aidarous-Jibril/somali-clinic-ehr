import client from "./client";

export const getLabResultsByPatient = async (patientId: string) => {
  const res = await client.get(`/lab-results/patient/${patientId}`);
  return res.data;
};