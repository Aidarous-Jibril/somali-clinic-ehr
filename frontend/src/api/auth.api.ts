import { api } from "./client";

export const loginRequest = async (clinicCode: string, email: string, password: string) => {
  const res = await api.post("/staff/login", { clinicCode, email, password,});

  return res.data;
};