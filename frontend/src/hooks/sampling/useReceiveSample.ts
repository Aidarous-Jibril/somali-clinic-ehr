import { useMutation, useQueryClient } from "@tanstack/react-query";
import { receiveSample } from "../../api/sampling.api";

export const useReceiveSample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sampleId: string) => receiveSample(sampleId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lab-orders"],
      });
    },
  });
};