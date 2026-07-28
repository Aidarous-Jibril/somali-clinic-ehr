// //src/api/order.api.ts
// import { api } from "./client";

// export const getOrdersByEncounter = async (encounterId: string) => {
//   const { data } = await api.get(`/orders/encounter/${encounterId}`);
//   return data;
// };

// export const getLabOrders = async () => {
//   const { data } = await api.get("/orders/lab/worklist");
//   return data;
// };
// export const getRadiologyOrders = async () => {
//   const { data } = await api.get("/orders/radiology/worklist");
//   return data;
// };

// export const startOrder = async (orderId: string) => {
//   const { data } = await api.post(`/orders/${orderId}/start`);
//   return data;
// };

// export const submitLabResult = async (
//   orderId: string,
//   payload: {
//     value: string;
//     unit?: string;
//     flag: "normal" | "high" | "low" | "critical";
//     comment?: string;
//   }
// ) => {
//   console.log("orderId", orderId)
//   console.log("payload", payload)
//   const { data } = await api.post(`/orders/${orderId}/result`, payload);
//   return data;
// };

// export const reviewOrder = async (orderId: string) => {
//   const { data } = await api.post(`/orders/${orderId}/review`);
//   return data;
// };

// export const completeOrder = async (orderId: string) => {
//   const { data } = await api.post(`/orders/${orderId}/complete`);
//   return data;
// };

// export const getPerformerUnits = async (category: string) => {
//   const { data } = await api.get("/orders/performer-units", {
//     params: { category },
//   });

//   return data;
// };


// src/api/order.api.ts

import { api } from "./client";

/**
 * Generic Order APIs
 * Shared across all order categories (Lab, Radiology, etc.)
 */

export const getOrdersByEncounter = async (encounterId: string) => {
  const { data } = await api.get(`/orders/encounter/${encounterId}`);
  return data;
};

export const startOrder = async (orderId: string) => {
  const { data } = await api.post(`/orders/${orderId}/start`);
  return data;
};

export const reviewOrder = async (orderId: string) => {
  const { data } = await api.post(`/orders/${orderId}/review`);
  return data;
};

export const completeOrder = async (orderId: string) => {
  const { data } = await api.post(`/orders/${orderId}/complete`);
  return data;
};

export const getPerformerUnits = async (category: string) => {
  const { data } = await api.get("/orders/performer-units", {
    params: { category },
  });

  return data;
};