//src/api/order.lifecycle.api.ts
import { api } from "./client";

export const startOrder = (id: string) =>
  api.post(`/orders/${id}/start`);

export const resultOrder = (id: string, payload: {
  value: string;
  unit?: string;
  flag: "normal" | "high" | "low" | "critical";
}) => 
  api.post(`/orders/${id}/result`, payload);

export const reviewOrder = (id: string) =>
  api.post(`/orders/${id}/review`);

export const completeOrder = (id: string) =>
  api.post(`/orders/${id}/complete`);

