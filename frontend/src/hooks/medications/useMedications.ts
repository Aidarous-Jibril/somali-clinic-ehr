import { useQuery } from "@tanstack/react-query";
import { getMedicationsByPatient } from "../../api/medication.api";

export const useMedications = (patientId?: string) =>
  useQuery({
    queryKey: ["medications", patientId],
    queryFn: () => getMedicationsByPatient(patientId!),
    enabled: !!patientId,
  });
