//src/api/staff.api.ts
import { api } from "./client";


export const fetchStaff = async ( role?: string ) => {
  const { data } = await api.get("/staff", {
    params: { role },
  });

  return data;
};

export const fetchStaffByUnit = async (unitId?: string) => {
  if (!unitId) return [];
  const { data } = await api.get(`/staff/unit/${unitId}`);
  return data;
};
