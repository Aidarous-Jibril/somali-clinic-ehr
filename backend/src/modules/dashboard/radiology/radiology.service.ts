//modules/dashboard/radiology/radiology.service.ts
import * as repo from "./radiology.repository.js";

export const getRadiologyWorklist = ( clinicId: string ) => {
  return repo.getRadiologyWorklist(clinicId);
};
