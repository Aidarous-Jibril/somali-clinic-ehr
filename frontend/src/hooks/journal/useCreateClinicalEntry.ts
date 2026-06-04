//src/hooks/useCreateClinicalEntry.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClinicalEntry } from "../../api/clinical.api";

export const useCreateClinicalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClinicalEntry,

    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({
        queryKey: ["clinical", newEntry.encounterId],
      });
    },
  });
};
