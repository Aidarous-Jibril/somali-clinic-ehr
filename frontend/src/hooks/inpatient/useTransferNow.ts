// /src/hooks/useTransferNow.ts
import { useMutation } from "@tanstack/react-query";
import { transferNow } from "../../api/inpatient.api";

export const useTransferNow = () => {
  return useMutation({
    mutationFn: transferNow,
  });
};