import { useQuery } from "@tanstack/react-query";

import { getSamplingWorklist } from "../../api/sampling.api";

export const useSamplingWorklist = () => {
  return useQuery({
    queryKey: ["sampling-worklist"],

    queryFn: async () => {
      return await getSamplingWorklist();
    },
  });
};