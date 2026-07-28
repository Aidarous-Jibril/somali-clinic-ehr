//dashboard/laboraroty/laboraroty.service.ts
import * as repo from "./laboratory.repository.js";

export const getLaboratoryWorklist = ( clinicId: string, performerUnitId: string ) => {
  return repo.getLaboratoryWorklist( clinicId, performerUnitId );
};