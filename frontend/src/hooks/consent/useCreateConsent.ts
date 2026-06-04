import { useMutation } from "@tanstack/react-query";
import { createConsent } from "../../api/consent.api";

export const useCreateConsent = () =>
  useMutation({
    mutationFn: createConsent,
  });