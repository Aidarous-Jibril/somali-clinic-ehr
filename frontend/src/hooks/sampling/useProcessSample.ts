import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processSample } from "../../api/sampling.api";

export const useProcessSample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sampleId: string) => processSample(sampleId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lab-orders"],
      });
    },
  });
};