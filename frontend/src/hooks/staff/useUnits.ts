import { useQuery } from "@tanstack/react-query";
import { getUnitsByClinic } from "../../api/units";

export const useUnits = (clinicId?: string) =>
  useQuery({
    queryKey: ["units", clinicId],
    queryFn: () => getUnitsByClinic(clinicId as string),
    enabled: !!clinicId,
  });
