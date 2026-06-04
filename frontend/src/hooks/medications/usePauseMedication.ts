import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pauseMedication } from "../../api/medication.api";

export const usePauseMedication = (patientId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pauseMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medications", patientId],
      });
    },
  });
};


