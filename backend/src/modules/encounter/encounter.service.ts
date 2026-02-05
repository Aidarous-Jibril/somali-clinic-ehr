import * as repo from "./encounter.repository.js";
import { CreateEncounterInput } from "./encounter.schema.js";

export const createEncounter = async (input: CreateEncounterInput) => {
  // 🔒 HARD EHR RULE:
  // A patient can have only ONE open encounter
  const existing = await repo.findOpenEncounter(input.patientId);

  if (existing) {
    throw {
      statusCode: 409,
      message: "Patient already has an open encounter",
    };
  }

  return repo.createEncounter({
    clinicId: input.clinicId,
    patientId: input.patientId,
    type: input.type,
    reason: input.reason,
    notes: input.notes,
  });
};

export const listEncountersByPatient = (patientId: string) => {
  return repo.listEncountersByPatient(patientId);
};

export const closeEncounter = async (encounterId: string) => {
  return repo.closeEncounter(encounterId);
};
