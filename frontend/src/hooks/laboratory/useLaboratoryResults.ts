//src/hooks/lab/useLaboratoryResults.ts
import { useQuery } from "@tanstack/react-query";
import { getLabResultsByPatient } from "../../api/dashboard/laboratoryDashboard.api";

export const useLaboratoryResults = (patientId?: string) => {
  return useQuery({
    queryKey: ["labResults", patientId],
    queryFn: () => getLabResultsByPatient(patientId!),
    enabled: !!patientId,
  });
};