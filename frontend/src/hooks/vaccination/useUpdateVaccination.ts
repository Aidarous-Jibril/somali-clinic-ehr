//src/hooks/vaccination/useDeclineVaccination.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineVaccination, completeVaccination } from "../../api/vaccination.api";

export const useDeclineVaccination = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: declineVaccination,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["vaccinations"] });
    },
  });
};

export const useCompleteVaccination = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: completeVaccination,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["vaccinations"] });
    },
  });
};