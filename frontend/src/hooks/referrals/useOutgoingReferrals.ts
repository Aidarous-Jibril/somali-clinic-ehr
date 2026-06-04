import { useQuery } from "@tanstack/react-query";
import { getOutgoingReferrals } from "../../api/referral.api";

export const useOutgoingReferrals = () => {
  return useQuery({
    queryKey: ["outgoingReferrals"],
    queryFn: getOutgoingReferrals,
  });
};