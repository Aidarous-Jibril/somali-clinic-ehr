import { useQuery } from "@tanstack/react-query";
import { fetchStaffByUnit } from "../../api/staff.api";

export const useStaffByUnit = (unitId?: string) => {
  return useQuery({
    queryKey: ["staff", "unit", unitId],
    queryFn: () => fetchStaffByUnit(unitId),
    enabled: !!unitId,
  });
};
