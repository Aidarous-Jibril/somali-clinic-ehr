// src/hooks/vaccination/useDeclineVaccination.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineVaccination } from "../../api/vaccination.api";
import type { VaccinationRecord } from "../../features/medications/types";

export const useDeclineVaccination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineVaccination,

    onSuccess: (vaccination: VaccinationRecord) => {
      queryClient.invalidateQueries({
        queryKey: ["vaccinations", vaccination.patientId],
      });
    },
  });
};