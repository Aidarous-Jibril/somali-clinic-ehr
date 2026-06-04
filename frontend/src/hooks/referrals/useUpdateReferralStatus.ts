// useUpdateReferralStatus.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReferralStatus } from "../../api/referral.api";
import { useAuth } from "../../context/AuthContext"; 

export const useUpdateReferralStatus = (patientId?: string) => {
  const queryClient = useQueryClient();
  const { unitId } = useAuth();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateReferralStatus({ id, status, unitId }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["referrals", patientId],
      });
    },
  });
};

