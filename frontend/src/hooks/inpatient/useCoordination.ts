// /src/hooks/useCoordination.ts
import { useQuery } from "@tanstack/react-query";
import { getCoordination } from "../../api/inpatient.api";

export const useCoordination = ( stayId?: string, open?: boolean ) => {
  return useQuery({
    queryKey: ["coordination", stayId],
    queryFn: () => getCoordination(stayId!),
    enabled: !!stayId && !!open,
  });
};