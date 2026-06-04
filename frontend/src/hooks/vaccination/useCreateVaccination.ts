


// src/hooks/vaccination/useCreateVaccination.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  RegisterVaccinationInput,
  VaccinationRecord,
} from "../../features/medications/types";
import { createVaccination } from "../../api/vaccination.api";

export const useCreateVaccination = () => {
  const qc = useQueryClient();

  return useMutation<VaccinationRecord, Error, RegisterVaccinationInput>({
    mutationFn: createVaccination,

    onSuccess: () => { qc.invalidateQueries({ queryKey: ["vaccinations"], });
    },
  });
};

