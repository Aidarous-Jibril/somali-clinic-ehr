// src/hooks/vaccination/useCompleteVaccination.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeVaccination } from "../../api/vaccination.api";
import type { VaccinationRecord } from "../../features/medications/types";

export const useCompleteVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeVaccination,

    onSuccess: (vaccination: VaccinationRecord) => {
      queryClient.invalidateQueries({
        queryKey: ["vaccinations", vaccination.patientId],
      });
    },
  });
};