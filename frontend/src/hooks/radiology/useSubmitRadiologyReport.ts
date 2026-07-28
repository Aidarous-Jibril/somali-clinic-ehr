//src/hooks/radiology/useSubmitRadiologyReport.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitRadiologyReport } from "../../api/dashboard/radiologyDashboard.api";

export const useSubmitRadiologyReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload, }: { orderId: string; payload: FormData; }) => submitRadiologyReport(orderId, payload),

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