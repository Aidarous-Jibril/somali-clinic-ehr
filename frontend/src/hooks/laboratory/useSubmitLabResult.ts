//src/hooks/lab/useSubmitLabResult.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitLabResult } from "../../api/dashboard/laboratoryDashboard.api";

export const useSubmitLabResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: {
        value: string;
        unit?: string;
        flag: "normal" | "high" | "low" | "critical";
        comment?: string;
      };
    }) => submitLabResult(orderId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lab-orders"],
      });
    },
  });
};