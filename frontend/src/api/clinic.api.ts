import { api } from "./client";

export const getClinics = async () => {
  const res = await api.get("/clinics");
  return res.data;
};
