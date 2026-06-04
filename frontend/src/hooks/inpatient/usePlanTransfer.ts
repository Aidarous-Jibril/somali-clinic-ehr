import { useMutation, useQueryClient } from "@tanstack/react-query";
import { planTransfer } from "../../api/inpatient.api";

export const usePlanTransfer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: planTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["active-contacts"] });
    },
  });
};