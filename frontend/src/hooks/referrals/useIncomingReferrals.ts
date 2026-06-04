import { useQuery } from "@tanstack/react-query";
import { getIncomingReferrals } from "../../api/referral.api";

export const useIncomingReferrals = () => {
  return useQuery({
    queryKey: ["incomingReferrals"],
    queryFn: getIncomingReferrals,
  });
};