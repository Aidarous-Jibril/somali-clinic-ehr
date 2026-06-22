import { prisma } from "../../config/prisma.js";
import * as repo from "./clinical-parameter.repository.js";
import { CreateClinicalParameterInput } from "./clinical-parameter.schema.js";

export const recordClinicalParameter = async ( input: CreateClinicalParameterInput & { clinicId: string; recordedByAccountId?: string } ) => {
  const encounter = await prisma.encounter.findUnique({
    where: { id: input.encounterId },
  });

  if (!encounter)
    throw new Error("Encounter not found");

  if (encounter.clinicId !== input.clinicId) 
    throw new Error("Forbidden");

  const entry = await repo.createEntry({
    encounterId: input.encounterId,
    name: input.name,
    value: input.value,
    note: input.note,
    recordedByAccountId: input.recordedByAccountId,
  });

  if (input.name === "NEWS2") {
    const score = Number(input.value);

    if (!Number.isNaN(score)) {
      await prisma.inpatientStay.updateMany({
        where: {
          encounterId: input.encounterId,
          dischargedAt: null,
        },
        data: {
          ews: score,
        },
      });
    }
  }

  return entry;
};

export const listClinicalParameters = async (encounterId: string, clinicId: string) => {
  const encounter = await prisma.encounter.findUnique({
    where: { id: encounterId },
  });

  if (!encounter) 
    throw new Error("Encounter not found");

  if (encounter.clinicId !== clinicId) 
    throw new Error("Forbidden");

  return repo.listByEncounter(encounterId);
};
