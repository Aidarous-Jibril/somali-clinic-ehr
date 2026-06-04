import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";

export const getActiveEncounter = async (patientId: string) => {
  const res = await api.get(`/encounters/active/${patientId}`);
  return res.data;
};

export const useActiveEncounter = (patientId?: string) => {
  return useQuery({
    queryKey: ["activeEncounter", patientId],
    queryFn: () => getActiveEncounter(patientId!),
    enabled: !!patientId,
  });
};
