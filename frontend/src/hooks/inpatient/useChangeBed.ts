import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeBed } from "../../api/inpatient.api";

export const useChangeBed = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: changeBed,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["active-contacts"] });
    },
  });
};