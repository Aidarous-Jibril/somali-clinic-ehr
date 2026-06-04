// /src/hooks/useTransfers.ts
import { useQuery } from "@tanstack/react-query";
import { getTransfers } from "../../api/inpatient.api";

export const useTransfers = (
  clinicId?: string,
  unitId?: string
) => {
  return useQuery({
    queryKey: ["transfers", clinicId, unitId],
    queryFn: () => getTransfers(clinicId!, unitId),
    enabled: !!clinicId,
  });
};