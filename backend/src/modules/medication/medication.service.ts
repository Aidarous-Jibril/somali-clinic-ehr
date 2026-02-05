import * as repo from "./medication.repository.js";
import { CreateMedicationInput } from "./medication.schema.js";
import { MedicationStatus } from "@prisma/client";

export const createMedication = (input: CreateMedicationInput) => {
  return repo.createMedication(input);
};

export const listActiveMedications = (patientId: string) => {
  return repo.findActiveByPatient(patientId);
};

export const stopMedication = (medicationId: string) => {
  return repo.updateStatus(medicationId, MedicationStatus.ended);
};

export const pauseMedication = (medicationId: string) => {
  return repo.updateStatus(medicationId, MedicationStatus.paused);
};
