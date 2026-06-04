import * as repo from "./unit.repository.js";
import { Roles } from "../../constants/roles.js";

// export const createUnit = ( input: any, user?: any ) => {
//   if ( user?.role === Roles.ClinicAdmin ) {
//     input.clinicId = user.clinicId;
//   }

//   return repo.createUnit(input);
// };

export const createUnit = async (
  input: any,
  user?: any
) => {
  if (user?.role === Roles.ClinicAdmin) {
    if (input.clinicId !== user.clinicId) {
      throw new Error(
        "You can only create units in your own clinic"
      );
    }
  }

  return repo.createUnit(input);
};
export const listUnitsByClinic = ( clinicId: string ) => {
  return repo.findByClinic(clinicId);
};