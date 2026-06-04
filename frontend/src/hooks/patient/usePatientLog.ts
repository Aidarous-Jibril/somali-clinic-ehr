import { useQuery } from "@tanstack/react-query";
import { getPatientLog } from "../../api/inpatient.api";

export const usePatientLog = (stayId?: string, open?: boolean) => {
  return useQuery({
    queryKey: ["patient-log", stayId],
    queryFn: () => getPatientLog(stayId!),
    enabled: !!stayId && !!open,
    staleTime: 1000 * 30,
  });
};