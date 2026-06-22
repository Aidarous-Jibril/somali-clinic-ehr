import * as repo from "./unit.repository.js";
import { Roles } from "../../constants/roles.js";


export const createUnit = async ( input: any, user?: any ) => {
  if (user?.role === Roles.ClinicAdmin) {
    if (input.clinicId !== user.clinicId) {
      throw new Error( "You can only create units in your own clinic" );
    }
  }

  return repo.createUnit(input);
};

export const listUnitsByClinic = ( clinicId: string, user?: any ) => {
  if ( user?.role !== Roles.SuperAdmin && clinicId !== user?.clinicId ) 
    throw new Error( "You can only view units from your own clinic" );

  return repo.findByClinic(clinicId);
};