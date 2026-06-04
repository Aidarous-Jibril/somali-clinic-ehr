import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  prepareDose,
  administerDose,
  selfAdministerDose,
  skipDose,
} from "../../api/medication.api";

export const usePrepareDose = (patientId?: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: prepareDose,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medications", patientId] });
    },
  });
};

export const useAdministerDose = (patientId?: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ doseId, payload }: { doseId: string; payload: any }) =>
      administerDose(doseId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medications", patientId] });
    },
  });
};

export const useSelfAdministerDose = (patientId?: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: selfAdministerDose,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medications", patientId] });
    },
  });
};

export const useSkipDose = (patientId?: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ doseId, payload }: { doseId: string; payload: any }) =>
      skipDose(doseId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medications", patientId] });
    },
  });
};