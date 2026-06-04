//src/api/staff.ts
import { api } from "./client";

export const fetchStaff = async () => {
  const { data } = await api.get("/staff");
  return data;
};

export const fetchStaffByUnit = async (unitId?: string) => {
  if (!unitId) return [];
  const { data } = await api.get(`/staff/unit/${unitId}`);
  return data;
};
