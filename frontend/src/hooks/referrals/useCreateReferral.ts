import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createReferral } from "../../api/referral.api";

export const useCreateReferral = (options?: any) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createReferral,

    onSuccess: (referral) => {
      qc.setQueryData(
        ["referrals", referral.sourcePatientId || referral.patientId],
        (old: any[] = []) => [referral, ...old]
      );

      toast.success("Referral created");
      options?.onSuccess?.(referral);
    },

    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || "Failed to create referral"
      ),
  });
};