import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../../api/fluidBalance.api";

export const useFluidBalance = (patientId: string) => {
  return useQuery({
    queryKey: ["fluidBalance", patientId],
    queryFn: async () => {
      const res = await api.getFluidBalanceByPatient(patientId);
      return res.data;
    },
    enabled: !!patientId,
  });
};

export const useCreateFluidBalance = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createFluidBalance,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["fluidBalance", variables.patientId],
      });
    },
  });
};