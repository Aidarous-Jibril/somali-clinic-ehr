import { api } from "./client";

export const loginRequest = async (email: string, password: string) => {
  const res = await api.post("/staff/login", { email, password,});

  return res.data;
};