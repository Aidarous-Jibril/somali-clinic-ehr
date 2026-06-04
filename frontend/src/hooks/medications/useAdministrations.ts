import { useQuery } from "@tanstack/react-query";
import { getAdministrations } from "../../api/medication.api";

export const useAdministrations = (medicationId?: string) =>
  useQuery({
    queryKey: ["medication-administrations", medicationId],
    queryFn: () => getAdministrations(medicationId!),
    enabled: !!medicationId,
  });