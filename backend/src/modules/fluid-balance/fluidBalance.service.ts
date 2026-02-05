// fluidBalance.service.ts
import * as repo from "./fluidBalance.repository.js";
import { CreateFluidBalanceInput } from "./fluidBalance.schema.js";

export const registerFluidBalance = (input: CreateFluidBalanceInput) => {
  const intake =
    input.oralMl +
    (input.enteralMl ?? 0);

  const output =
    (input.urineMl ?? 0) +
    (input.bleedingMl ?? 0) +
    (input.faecesMl ?? 0) +
    (input.vomitingMl ?? 0);

  return repo.createFluidBalance({
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

export const listFluidBalanceForPatient = (patientId: string) =>
  repo.findByPatient(patientId);
