import * as repo from "./patient.repository.js";
import { CreatePatientInput, UpdatePatientInput, } from "./patient.schema.js";

export const createPatient = async ( input: CreatePatientInput, user?: any ) => {
  if (!user) throw new Error("Unauthorized");

  const clinicId = user.clinicId;
  const dob = new Date(input.dateOfBirth);

  const existing = await repo.findDuplicatePatient({
    clinicId,
    firstName: input.firstName,
    lastName: input.lastName,
    dateOfBirth: dob,
    phone: input.phone,
    nationalId: input.nationalId,
  });

  if (existing) throw new Error("Patient already exists");

  const clinic = await repo.incrementClinicMrn(clinicId);

  const mrn = `${clinic.code}-${String( clinic.mrnCounter ).padStart(6, "0")}`;

  return repo.createPatient({
    clinicId,
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

export const listPatients = (user?: any) => {
  if (!user) throw new Error("Unauthorized");

  if (user?.role === "SuperAdmin")  return repo.findAllPatients();

  return repo.findPatientsByClinic(user.clinicId);
};

export const getPatientById = async ( patientId: string, user?: any ) => {
  if (!user) throw new Error("Unauthorized");

  const patient = await repo.findPatientById(patientId);
  if (!patient) throw new Error("Patient not found");
  

  if ( user?.role !== "SuperAdmin" && patient.clinicId !== user.clinicId ) 
    throw new Error( "You can only view patients from your own clinic" );

  return patient;
};

export const searchPatients = ( q: string, user?: any ) => {
  if (!user) throw new Error("Unauthorized");

  if (user?.role === "SuperAdmin")  return repo.searchPatients(q);
  
  return repo.searchPatients(q, user.clinicId);
};

export const updatePatient = async ( patientId: string, data: UpdatePatientInput, user?: any ) => {
  if (!user) throw new Error("Unauthorized");

  const patient = await repo.findPatientById(patientId);
  if (!patient)  throw new Error("Patient not found");

  if ( user?.role !== "SuperAdmin" && patient.clinicId !== user.clinicId ) 
    throw new Error( "You can only update patients from your own clinic");

  return repo.updatePatient(patientId, {
    ...data,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
  });
};

export const deletePatient = async ( patientId: string, user?: any ) => {
  if (!user) throw new Error("Unauthorized");

  const patient = await repo.findPatientById(patientId);
  if (!patient) throw new Error("Patient not found");
  

  if ( user?.role !== "SuperAdmin" && patient.clinicId !== user.clinicId ) {
    throw new Error( "You can only delete patients from your own clinic");
  }

  return repo.softDeletePatient(patientId);
};