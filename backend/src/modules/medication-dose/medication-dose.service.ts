import {
  MedicationAdministrationAction,
  MedicationDoseStatus,
} from "@prisma/client";

import * as repo from "./medication-dose.repository.js";

import {
  AdministerDoseInput,
  CreateMedicationDoseInput,
  SkipDoseInput,
} from "./medication-dose.schema.js";

/**
 * CREATE
 */
export const createDose = (
  medicationId: string,
  input: CreateMedicationDoseInput
) => {
  return repo.createDose({
    medicationId,
    ...input,
  });
};

/**
 * Resolve a dose ID.
 *
 * Supports:
 * 1. Real database IDs
 * 2. Fallback IDs from the UI
 */
const resolveDose = async ( doseId: string ) => {
  const existing = await repo.findDoseById(doseId);

  if (existing) return existing;
  

  if (!doseId.startsWith("fallback-")) throw new Error("Dose not found");
  

  const parts = doseId
    .replace("fallback-", "")
    .split("-");

  const index = Number(parts.pop());

  const medicationId = parts.join("-");

  if (!medicationId) {
    throw new Error(
      "Invalid fallback dose ID"
    );
  }

  const existingDoses =
    await repo.getDosesByMedication(
      medicationId
    );

  if (existingDoses.length > 0) {
    return (
      existingDoses[index] ??
      existingDoses[0]
    );
  }

  const createdDose =
    await repo.createDose({
      medicationId,
      scheduledDate: new Date(),
      label: "Scheduled dose",
      tooltip: `Dose ${index + 1}`,
      isPrn: false,
    });

  return repo.findDoseById(
    createdDose.id
  );
};

/**
 * PREPARE
 */
export const prepareDose = async ( doseId: string, performedByAccountId: string, clinicId: string ) => {
  const dose = await repo.findDoseWithMedication( doseId );

  if (!dose) throw new Error("Dose not found");
  

  if ( dose.medication.clinicId !== clinicId ) throw new Error("Forbidden");

  await repo.updateDoseStatus(
    dose.id,
    MedicationDoseStatus.prepared
  );

  return repo.createAdministration({
    medicationId: dose.medicationId,
    doseId: dose.id,

    action:
      MedicationAdministrationAction.prepare,

    performedByAccountId,
  });
};

/**
 * ADMINISTER
 */
export const administerDose = async ( doseId: string, input: AdministerDoseInput, performedByAccountId: string, clinicId: string ) => {
  const dose = await repo.findDoseWithMedication( doseId );

  if (!dose)  throw new Error("Dose not found");
  if ( dose.medication.clinicId !== clinicId) throw new Error("Forbidden");

  await repo.updateDoseStatus(
    dose.id,
    MedicationDoseStatus.given
  );

  return repo.createAdministration({
    medicationId: dose.medicationId,
    doseId: dose.id,
    action: MedicationAdministrationAction.administer,
    performedByAccountId,

    ...input,
  });
};

/**
 * SELF ADMINISTER
 */
export const selfAdministerDose = async ( doseId: string, performedByAccountId: string, clinicId: string ) => {
  const dose = await repo.findDoseWithMedication( doseId );

  if (!dose)  throw new Error("Dose not found");

  if ( dose.medication.clinicId !== clinicId ) throw new Error("Forbidden");
  

  await repo.updateDoseStatus(
    dose.id,
    MedicationDoseStatus.selfAdmin
  );

  return repo.createAdministration({
    medicationId: dose.medicationId,
    doseId: dose.id,

    action:
      MedicationAdministrationAction.selfAdminister,

    performedByAccountId,
  });
};

/**
 * SKIP
 */
export const skipDose = async ( doseId: string, input: SkipDoseInput, performedByAccountId: string, clinicId: string ) => {
  const dose = await repo.findDoseWithMedication( doseId );

  if (!dose) throw new Error("Dose not found");

  if ( dose.medication.clinicId !== clinicId ) throw new Error("Forbidden");
  

  await repo.updateDoseStatus(
    dose.id,
    MedicationDoseStatus.skipped
  );

  return repo.createAdministration({
    medicationId: dose.medicationId,
    doseId: dose.id,
    action: MedicationAdministrationAction.skip,
    performedByAccountId,

    reason: input.reason,
    comment: input.comment,
  });
};

/**
 * LIST ADMINISTRATIONS
 */
export const listAdministrations = ( medicationId: string ) => {
  return repo.getAdministrationsByMedication(medicationId );
};