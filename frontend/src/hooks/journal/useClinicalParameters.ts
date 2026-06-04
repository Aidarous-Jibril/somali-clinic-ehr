//src/hooks/journal/useClinicalParameters.ts
import { useQuery } from "@tanstack/react-query";
import { getClinicalByEncounter } from "../../api/clinical.api";

export const useClinicalParameters = (encounterId?: string) => {
  return useQuery({
    queryKey: ["clinical", encounterId],
    queryFn: () => getClinicalByEncounter(encounterId!),
    enabled: !!encounterId,
  });
};
