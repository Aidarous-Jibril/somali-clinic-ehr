//src/hooks/radiology/useStartRadiologyOrder.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startOrder } from "../../api/order.api";

export const useStartRadiologyOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startOrder,

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