// src/hooks/vaccination/useVaccinations.ts

import { useQuery } from "@tanstack/react-query";

import { getVaccinationsByPatient } from "../../api/vaccination.api";
import type { VaccinationRecord } from "../../features/medications/types";

export const useVaccinations = (patientId?: string) => {
  return useQuery<VaccinationRecord[]>({
    queryKey: ["vaccinations", patientId],
    queryFn: () => getVaccinationsByPatient(patientId!),
    enabled: Boolean(patientId),
  });
};