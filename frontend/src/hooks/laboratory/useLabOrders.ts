// src/hooks/lab/useLabResults.ts
import { useQuery } from "@tanstack/react-query";
import { getLabOrders } from "../../api/dashboard/laboratoryDashboard.api";

export const useLabOrders = () => {
  return useQuery({
    queryKey: ["lab-orders"],
    queryFn: getLabOrders,
  });
};

