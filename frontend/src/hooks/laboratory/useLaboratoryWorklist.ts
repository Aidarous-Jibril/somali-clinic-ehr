//src/hooks/lab/useLaboratoryWorklist.ts
import { useQuery } from "@tanstack/react-query";

import { getLabOrders } from "../../api/dashboard/laboratoryDashboard.api";

export const useLaboratoryWorklist = () => {
  return useQuery({
    queryKey: ["laboratory-worklist"],
    queryFn: getLabOrders,
  });
};