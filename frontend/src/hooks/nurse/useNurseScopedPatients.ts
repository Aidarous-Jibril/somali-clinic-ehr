import { useQuery } from "@tanstack/react-query";
import {
  getAssignedPatients,
  getMedicationDuePatients,
  getVitalsOverduePatients,
  getFluidAlertPatients,
  getPendingReferralPatients,
} from "../../api/dashboard/nurseDashboard.api";

export const useNurseScopedPatients = ( scope?: string ) => {
  return useQuery({
    queryKey: ["nurse-scoped-patients", scope],
    queryFn: async () => {
      switch (scope) {
        case "assigned":
          return getAssignedPatients();

        case "medication-due":
          return getMedicationDuePatients();

        case "vitals-overdue":
          return getVitalsOverduePatients();

        case "fluid-alerts":
          return getFluidAlertPatients();

        case "pending-referrals":
          return getPendingReferralPatients();

        default:
          return [];
      }
    },
    enabled: !!scope,
  });
};