import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createPatient } from "../../api/patient.api";
import type { CreatePatientPayload } from "../../features/patient/types";

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePatientPayload) =>
      createPatient(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      toast.success("Patient created successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create patient"
      );
    },
  });
};