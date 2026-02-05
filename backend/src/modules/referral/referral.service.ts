import * as repo from "./referral.repository.js";
import { CreateReferralInput } from "./referral.schema.js";
import { ReferralStatus } from "@prisma/client";

export const createReferral = (input: CreateReferralInput) => {
  return repo.createReferral({
    ...input,
    urgent: input.urgent ?? false,
    hasAdditionalInfo: input.hasAdditionalInfo ?? false,
  });
};

export const listByPatient = (patientId: string) => {
  return repo.findByPatient(patientId);
};

export const updateReferralStatus = (
  referralId: string,
  status: ReferralStatus
) => {
  return repo.updateStatus(referralId, status);
};
