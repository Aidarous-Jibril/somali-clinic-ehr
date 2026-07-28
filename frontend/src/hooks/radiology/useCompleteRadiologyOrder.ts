//src/hooks/radiology/useCompleteRadiologyOrder.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOrder } from "../../api/order.api";

export const useCompleteRadiologyOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["radiology-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["radiology-worklist"],
      });
    },
  });
};