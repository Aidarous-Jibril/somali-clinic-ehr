import { useQuery } from "@tanstack/react-query";
import { getActiveContacts } from "../../api/inpatient.api";

export const useActiveContacts = () => {
  const clinicId =
    JSON.parse(localStorage.getItem("auth_user") || "{}")?.clinicId;

  return useQuery({
    queryKey: ["active-contacts", clinicId],
    queryFn: () => getActiveContacts(clinicId),
    enabled: !!clinicId,
    staleTime: 1000 * 15,
  });
};