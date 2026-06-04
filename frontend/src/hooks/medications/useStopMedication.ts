import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stopMedication } from "../../api/medication.api";

export const useStopMedication = (patientId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stopMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medications", patientId],
      });
    },
  });
};