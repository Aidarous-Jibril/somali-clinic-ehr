// src/utils/patient.ts
export const getPatientName = (p?: {
  firstName?: string;
  lastName?: string;
}) => {
  return `${p?.firstName ?? ""} ${p?.lastName ?? ""}`.trim() || "Unknown";
};