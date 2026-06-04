import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";

export const useTeams = ( clinicId?: string, unitId?: string ) => {
  return useQuery({
    queryKey: ["teams", clinicId, unitId],
    enabled: !!clinicId,
    queryFn: async () => {
      const { data } = await api.get("/teams", {
        params: { clinicId, unitId },
      });
      return data;
    },
  });
};