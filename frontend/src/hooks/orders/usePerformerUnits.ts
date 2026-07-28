import { useQuery } from "@tanstack/react-query";
import { getPerformerUnits } from "../../api/order.api";

export const usePerformerUnits = ( category?: string ) => {
  return useQuery({
    queryKey: ["performerUnits", category],

    queryFn: () =>
      getPerformerUnits(category!),

    enabled: !!category,
  });
};