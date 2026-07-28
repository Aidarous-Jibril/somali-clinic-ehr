//src/hooks/radiology/useRadiologyResults.ts
import { useQuery } from "@tanstack/react-query";
import { getRadiologyResultsByPatient } from "../../api/dashboard/radiologyDashboard.api";

export const useRadiologyResults = ( patientId?: string ) => {
  return useQuery({
    queryKey: ["radiologyResults", patientId],
    queryFn: () => getRadiologyResultsByPatient(patientId!),
    enabled: !!patientId,
  });
};