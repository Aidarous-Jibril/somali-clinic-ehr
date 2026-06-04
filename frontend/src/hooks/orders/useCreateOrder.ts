import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../../api/patient.api";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.encounterId], 
      });
    },
  });
};
