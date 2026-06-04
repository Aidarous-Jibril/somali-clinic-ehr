import { useQuery } from "@tanstack/react-query";
import { searchPatients } from "../../api/patient.api";

export const usePatientSearch = (q: string) => {
  return useQuery({
    queryKey: ["patient-search", q],
    queryFn: () => searchPatients(q),
    enabled: q.trim().length >= 2,
  });
};