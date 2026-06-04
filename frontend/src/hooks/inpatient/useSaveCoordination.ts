import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCoordination } from "../../api/inpatient.api";

export const useSaveCoordination = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: saveCoordination,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["coordination", variables.stayId],
      });

      qc.invalidateQueries({
        queryKey: ["active-contacts"],
      });
    },
  });
};