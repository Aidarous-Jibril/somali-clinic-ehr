// /src/hooks/useReserveBed.ts
import { useMutation } from "@tanstack/react-query";
import { reserveTransferBed } from "../../api/inpatient.api";

export const useReserveBed = () => {
  return useMutation({
    mutationFn: reserveTransferBed,
  });
};