import { useQuery } from "@tanstack/react-query";
import { getMedicationFavorites } from "../../api/medication.api";

export const useMedicationFavorites = () => {
  return useQuery({
    queryKey: ["medication-favorites"],
    queryFn: getMedicationFavorites,
  });
};