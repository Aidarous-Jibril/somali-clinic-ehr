//src/api/order.api.ts
import { api } from "./client";

export const getOrdersByEncounter = async (encounterId: string) => {
  const res = await api.get(`/orders/encounter/${encounterId}`);
  return res.data;
};

