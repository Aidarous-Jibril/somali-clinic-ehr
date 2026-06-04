import { useQuery } from "@tanstack/react-query";
import { fetchStaff } from "../../api/staff.api";

export const useStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });
};
