import * as repo from "./patient.repository.js";
import { CreatePatientInput } from "./patient.schema.js";

export const createPatient = async (input: CreatePatientInput) => {
  // 1. Increment MRN counter atomically
  const clinic = await repo.incrementClinicMrn(input.clinicId);

  const mrn = `${clinic.code}-${String(clinic.mrnCounter).padStart(6, "0")}`;

  // 2. Create patient (FK style — clean)
  return repo.createPatient({
    clinicId: input.clinicId,
    mrn,
    firstName: input.firstName,
    lastName: input.lastName,
    gender: input.gender,
    dateOfBirth: new Date(input.dateOfBirth),
    phone: input.phone,
    email: input.email,
    nationalId: input.nationalId,
  });
};

export const listPatients = (clinicId: string) => {
  return repo.findPatientsByClinic(clinicId);
};
