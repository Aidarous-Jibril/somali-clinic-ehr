// src/modules/patient/patient.service.ts
import * as repo from "./patient.repository.js";
import { CreatePatientInput } from "./patient.schema.js";

type CreatePatientWithClinic = CreatePatientInput & {
  clinicId: string;
};

export const createPatient = async ( input: CreatePatientWithClinic ) => {
  const dob = new Date(input.dateOfBirth);

  const existing = await repo.findDuplicatePatient({
    clinicId: input.clinicId,
    firstName: input.firstName,
    lastName: input.lastName,
    dateOfBirth: dob,
    phone: input.phone,
    nationalId: input.nationalId,
  });

  if (existing) throw new Error("Patient already exists");

  const clinic = await repo.incrementClinicMrn(input.clinicId);

  const mrn = `${clinic.code}-${String(clinic.mrnCounter).padStart(6, "0")}`;

  return repo.createPatient({
    clinicId: input.clinicId,
    mrn,
    firstName: input.firstName,
    lastName: input.lastName,
    gender: input.gender,
    dateOfBirth: dob,
    phone: input.phone,
    email: input.email,
    nationalId: input.nationalId,
  });
};
export const listPatients = (clinicId: string) => {
  return repo.findPatientsByClinic(clinicId);
};

export const getPatientById = async ( patientId: string ) => {
  const patient = await repo.findPatientById(patientId);

  if (!patient) throw new Error("Patient not found");

  return patient;
};

export const searchPatients = ( clinicId: string, q: string ) => {
  return repo.searchPatients(clinicId, q);
};