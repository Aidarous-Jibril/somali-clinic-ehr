// hooks/orders/useLabOrders.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";

export const useLabOrders = () => {
  return useQuery({
    queryKey: ["lab-orders"],
    queryFn: async () => {
      const res = await api.get("/orders/lab/worklist");
      return res.data;
    },
  });
};