import { useQuery } from "@tanstack/react-query";
import { getIncomingReferrals, getOutgoingReferrals } from "../../api/referral.api";

export const useDashboardReferrals = () => {
  const incoming = useQuery({
    queryKey: ["incomingReferrals"],
    queryFn: getIncomingReferrals,
  });

  const outgoing = useQuery({
    queryKey: ["outgoingReferrals"],
    queryFn: getOutgoingReferrals,
  });

  return {
    incoming: incoming.data || [],
    outgoing: outgoing.data || [],
    isLoading: incoming.isLoading || outgoing.isLoading,
  };
};