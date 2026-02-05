import * as repo from "./clinical-parameter.repository.js";
import { CreateClinicalParameterInput } from "./clinical-parameter.schema.js";

export const recordClinicalParameter = async (
  input: CreateClinicalParameterInput
) => {
  return repo.createEntry({
    encounterId: input.encounterId,
    name: input.name,
    value: input.value,
    note: input.note,
    recordedBy: input.recordedBy,
  });
};

export const listClinicalParameters = (encounterId: string) => {
  return repo.listByEncounter(encounterId);
};
