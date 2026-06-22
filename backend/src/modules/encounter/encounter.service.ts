import * as repo from "./encounter.repository.js";
import { CreateEncounterInput } from "./encounter.schema.js";

type CreateEncounterWithClinic = CreateEncounterInput & {
    clinicId: string;
  };
  

export const createEncounter = async ( input: CreateEncounterWithClinic ) => {
  
  const patient = await repo.findPatientById(input.patientId);
  
  if (!patient) 
    throw { statusCode: 404, message: "Patient not found",};
  
  if (patient.clinicId !== input.clinicId) 
    throw { statusCode: 403, message: "You can only create encounters for patients in your own clinic",};
  
  const existing = await repo.findOpenEncounter( input.patientId );

  if (existing) 
    throw { statusCode: 409, message: "Patient already has an open encounter", };
  
  return repo.createEncounter({
    clinicId: input.clinicId,
    patientId: input.patientId,
    type: input.type,
    reason: input.reason,
    notes: input.notes,
  });
};

export const listEncountersByPatient = ( patientId: string, clinicId?: string) => {
  return repo.listEncountersByPatient(patientId, clinicId);
};

export const getActiveEncounter = ( patientId: string, clinicId?: string ) => {
  return repo.findOpenEncounter(patientId, clinicId);
};

export const closeEncounter = async ( encounterId: string, clinicId?: string ) => {
  const encounter = await repo.findEncounterById( encounterId, clinicId );

  if (!encounter)
    throw new Error("Encounter not found");

  if (encounter.status === "closed") 
    throw new Error("Encounter already closed");

  return repo.closeEncounter(encounterId);
};