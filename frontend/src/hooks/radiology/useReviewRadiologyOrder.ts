//src/hooks/radiology/useReviewRadiologyOrder.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewOrder } from "../../api/order.api";

export const useReviewRadiologyOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewOrder,

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