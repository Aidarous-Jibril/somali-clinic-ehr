import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeSample } from "../../api/sampling.api";

export const useCompleteSample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sampleId: string) => completeSample(sampleId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lab-orders"],
      });
    },
  });
};