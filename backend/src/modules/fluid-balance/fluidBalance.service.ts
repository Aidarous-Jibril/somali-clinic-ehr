// fluidBalance.service.ts
import * as repo from "./fluidBalance.repository.js";
import { CreateFluidBalanceInput, UpdateFluidBalanceInput } from "./fluidBalance.schema.js";

export const registerFluidBalance = async ( input: CreateFluidBalanceInput, user: any ) => {
  const patient = await repo.findPatientById(input.patientId);

  if (!patient) throw new Error("Patient not found");
  
  if (user.role !== "SuperAdmin" && patient.clinicId !== user.clinicId) throw new Error("Forbidden");
  
  const intake =
    input.oralMl +
    (input.enteralMl ?? 0);

  const output =
    (input.urineMl ?? 0) +
    (input.bleedingMl ?? 0) +
    (input.faecesMl ?? 0) +
    (input.vomitingMl ?? 0);

  return repo.createFluidBalance({
    clinicId: patient.clinicId, 
    patientId: input.patientId,
    encounterId: input.encounterId,
    measuredAt: new Date(input.measuredAt),
    label: input.label,
    period: input.period,
    intakeMl: intake,
    outputMl: output,
    balanceMl: intake - output,
    details: {
      oralMl: input.oralMl,
      oralKcal: input.oralKcal ?? 0,
      enteralMl: input.enteralMl ?? 0,
      enteralKcal: input.enteralKcal ?? 0,
      urineMl: input.urineMl ?? 0,
      bleedingMl: input.bleedingMl ?? 0,
      faecesMl: input.faecesMl ?? 0,
      vomitingMl: input.vomitingMl ?? 0,
    },
  });
};

export const listFluidBalanceForPatient = (patientId: string, user: any) =>
  repo.findByPatient(patientId, user.clinicId);


export const updateFluidBalance = async ( id: string, input: UpdateFluidBalanceInput, user: any ) => {
  const existing = await repo.findById(id);

  if (!existing) 
    throw new Error("Fluid balance entry not found");

  if (!existing.details)
      throw new Error("Fluid balance details not found");

  if (user.role !== "SuperAdmin" && existing.clinicId !== user.clinicId)
    throw new Error("Forbidden");

  const oralMl = input.oralMl ?? existing.details.oralMl;
  const enteralMl = input.enteralMl ?? existing.details.enteralMl;
  const urineMl = input.urineMl ?? existing.details.urineMl;
  const bleedingMl = input.bleedingMl ?? existing.details.bleedingMl;
  const faecesMl = input.faecesMl ?? existing.details.faecesMl;
  const vomitingMl = input.vomitingMl ?? existing.details.vomitingMl;

  const intake = oralMl + enteralMl;

  const output =
    urineMl +
    bleedingMl +
    faecesMl +
    vomitingMl;

  return repo.updateFluidBalance(id, {
    measuredAt: input.measuredAt
      ? new Date(input.measuredAt)
      : existing.measuredAt,

    label: input.label ?? existing.label,
    period: input.period ?? existing.period,

    intakeMl: intake,
    outputMl: output,
    balanceMl: intake - output,

    details: {
      oralMl,
      oralKcal: input.oralKcal ?? existing.details.oralKcal,
      enteralMl,
      enteralKcal:
        input.enteralKcal ?? existing.details.enteralKcal,
      urineMl,
      bleedingMl,
      faecesMl,
      vomitingMl,
    },
  });
};