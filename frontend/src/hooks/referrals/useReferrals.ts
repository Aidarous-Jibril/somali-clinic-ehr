import { useQuery } from "@tanstack/react-query";
import { getReferralsByPatient } from "../../api/referral.api";

export const useReferrals = (patientId?: string) => {
  return useQuery({
    queryKey: ["referrals", patientId],
    queryFn: () => getReferralsByPatient(patientId!),
    enabled: !!patientId,
  });
};
