import { api } from "./client";

export const getUnitsByClinic = async (clinicId: string) => {
  const res = await api.get(`/units?clinicId=${clinicId}`);
  return res.data;
};
