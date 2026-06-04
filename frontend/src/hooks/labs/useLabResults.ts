import { useQuery } from "@tanstack/react-query";
import { getLabResultsByPatient } from "../../api/lab.api";

export const useLabResults = (patientId?: string) => {
  return useQuery({
    queryKey: ["labResults", patientId],
    queryFn: () => getLabResultsByPatient(patientId!),
    enabled: !!patientId,
  });
};