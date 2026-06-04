import * as repo from "./encounter.repository.js";
import { CreateEncounterInput } from "./encounter.schema.js";

type CreateEncounterWithClinic = CreateEncounterInput & {
    clinicId: string;
  };
  

export const createEncounter = async ( input: CreateEncounterWithClinic ) => {
  const existing = await repo.findOpenEncounter( input.patientId );

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

export const listEncountersByPatient = ( patientId: string ) => {
  return repo.listEncountersByPatient(patientId);
};

export const getActiveEncounter = ( patientId: string ) => {
  return repo.findOpenEncounter(patientId);
};

export const closeEncounter = ( encounterId: string ) => {
  return repo.closeEncounter(encounterId);
};