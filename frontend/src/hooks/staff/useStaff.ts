//src/hooks/staff/useStaff.ts
import { useQuery } from "@tanstack/react-query";
import { fetchStaff } from "../../api/staff.api";

export const useStaff = ( role?: string ) => {
  return useQuery({
    queryKey: ["staff", role],
    queryFn: () => fetchStaff(role),
  });
};