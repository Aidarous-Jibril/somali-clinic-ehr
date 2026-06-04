// hooks/useResumeMedication.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeMedication } from "../../api/medication.api";

export const useResumeMedication = (patientId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medications", patientId],
      });
    },
  });
};