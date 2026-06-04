//src/api/appointments.ts
import api from "./client";

// GET
export const getAppointments = (params?: any) =>
  api.get("/appointments", { params });

// CREATE
export const createAppointment = (data: any) =>
  api.post("/appointments", data);

// ---------------------
// LIFECYCLE
// ---------------------
export const arrivedAppointment = (id: string) =>
  api.post(`/appointments/${id}/arrived`);

export const startAppointment = (id: string) =>
  api.post(`/appointments/${id}/start`);

export const completeAppointment = (id: string) =>
  api.post(`/appointments/${id}/complete`);

export const cancelAppointment = (id: string) =>
  api.post(`/appointments/${id}/cancel`);