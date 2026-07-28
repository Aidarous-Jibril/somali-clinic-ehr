import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectSample } from "../../api/sampling.api";

export const useCollectSample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sampleId, notes, }: { sampleId: string; notes?: string;}) => collectSample(sampleId, notes),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lab-orders"],
      });
    },
  });
};