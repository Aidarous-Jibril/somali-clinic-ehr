import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNutritionProduct } from "../../api/medication.api";

export function useCreateNutritionProduct(patientId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNutritionProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["nutrition-products", patientId],
      });
    },
  });
}

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createNutritionProduct } from "../../api/medication.api";

// export function useCreateNutritionProduct(patientId?: string ) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createNutritionProduct,
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["nutrition-products", patientId],
//       });
//     },
//   });
// }