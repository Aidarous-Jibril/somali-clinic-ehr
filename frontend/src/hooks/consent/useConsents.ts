import { useQuery } from "@tanstack/react-query";
import { getConsents } from "../../api/consent.api";

export const useConsents = (patientId?: string) =>
  useQuery({
    queryKey: ["consents", patientId],
    queryFn: () => getConsents(patientId!),
    enabled: !!patientId,
  });