import { useQuery } from "@tanstack/react-query";
import { fetchPatients } from "../../api/patient.api";

export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });
};