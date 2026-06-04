import * as repo from "./vaccination.repository.js";

export const createVaccination = ( input: any ) => {
  return repo.createVaccination(input);
};

export const listVaccinations = ( patientId: string, clinicId: string ) => {
  return repo.findByPatient( patientId, clinicId );
};

export const declineVaccination = async ( id: string, clinicId: string ) => {
    const vaccination = await repo.findById(id);

    if (!vaccination) throw new Error( "Vaccination not found");
    
    if ( vaccination.clinicId !== clinicId )  throw new Error("Forbidden");
    
    return repo.updateStatus( id, "declined");
  };

export const completeVaccination = async ( id: string, clinicId: string ) => {
    const vaccination = await repo.findById(id);

    if (!vaccination) throw new Error( "Vaccination not found" );
    
    if ( vaccination.clinicId !== clinicId ) throw new Error("Forbidden");
    
    return repo.updateStatus( id, "completed" );
  };