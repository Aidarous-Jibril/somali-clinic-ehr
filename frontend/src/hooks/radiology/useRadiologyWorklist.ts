//src/hooks/radiology/useRadiologyWorklist.ts
import { useQuery } from "@tanstack/react-query";

import { getRadiologyWorklist } from "../../api/dashboard/radiologyDashboard.api";

export const useRadiologyWorklist = () => {
  return useQuery({
    queryKey: ["radiology-worklist"],

    queryFn: getRadiologyWorklist,
  });
};