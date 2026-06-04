import { useMutation } from "@tanstack/react-query";
import { updateConsentStatus } from "../../api/consent.api";

export const useUpdateConsentStatus = () =>
  useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "ended" | "upcoming" | "cancelled";
    }) => updateConsentStatus(id, { status }),
  });