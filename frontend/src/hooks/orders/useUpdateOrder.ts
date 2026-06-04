import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder } from "../../api/patient.api";

export const useUpdateOrder = (encounterId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateOrder(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", encounterId], 
      });
    },
  });
};
