// /src/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { getOrdersByEncounter } from "../../api/order.api";
import { mapOrderToUi } from "../../features/patient-overview/mappers/order.mapper";


export const useOrders = (encounterId?: string) => {
  return useQuery({
    queryKey: ["orders", encounterId],
    queryFn: async () => {
      const data = await getOrdersByEncounter(encounterId!);
      return data.map(mapOrderToUi);
    },
    enabled: !!encounterId,
  });
};
