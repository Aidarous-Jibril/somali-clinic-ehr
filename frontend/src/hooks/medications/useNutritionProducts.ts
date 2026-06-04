import { useQuery } from "@tanstack/react-query";
import { getNutritionProductsByPatient } from "../../api/medication.api";

export const useNutritionProducts = (patientId?: string) =>
  useQuery({
    queryKey: ["nutrition-products", patientId],
    queryFn: () => getNutritionProductsByPatient(patientId!),
    enabled: !!patientId,
  });