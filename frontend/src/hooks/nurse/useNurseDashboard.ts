import { useQueries } from "@tanstack/react-query";
import {
  getAssignedPatients,
  getMedicationDuePatients,
  getVitalsOverduePatients,
  getFluidAlertPatients,
  getPendingReferralPatients,
  getWardOccupancy,
} from "../../api/dashboard/nurseDashboard.api";

export const useNurseDashboard = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["assignedPatients"],
        queryFn: getAssignedPatients,
      },
      {
        queryKey: ["medicationDue"],
        queryFn: getMedicationDuePatients,
      },
      {
        queryKey: ["vitalsOverdue"],
        queryFn: getVitalsOverduePatients,
      },
      {
        queryKey: ["fluidAlerts"],
        queryFn: getFluidAlertPatients,
      },
      {
        queryKey: ["pendingReferrals"],
        queryFn: getPendingReferralPatients,
      },
      {
        queryKey: ["wardOccupancy"],
        queryFn: getWardOccupancy,
      },
    ],
  });

  return {
    assignedPatients: results[0].data ?? [],
    medicationDue: results[1].data ?? [],
    vitalsOverdue: results[2].data ?? [],
    fluidAlerts: results[3].data ?? [],
    pendingReferrals: results[4].data ?? [],
    wardOccupancy: results[5].data ?? null,
    isLoading: results.some((q) => q.isLoading),
  };
};