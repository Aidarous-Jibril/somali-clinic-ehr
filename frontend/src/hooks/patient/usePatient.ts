import { useQuery } from "@tanstack/react-query";
import { getPatitent } from "../../api/patient.api";

export const usePatient = ( patientId?: string ) => {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatitent(patientId!),
    enabled: !!patientId,
  });
};