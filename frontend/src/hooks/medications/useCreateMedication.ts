import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMedication } from "../../api/medication.api";

export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMedication,
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: [ "medications", result.data.patientId,],
      });
    },
  });
}