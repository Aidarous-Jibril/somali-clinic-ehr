import * as repo from "./vaccination.repository.js";

export const createVaccination = async (
  input: any
) => {
  const patient = await repo.findPatientById(
    input.patientId
  );

  if (!patient)
    throw {
      statusCode: 404,
      message: "Patient not found",
    };

  if (patient.clinicId !== input.clinicId)
    throw {
      statusCode: 403,
      message: "Forbidden",
    };

  if (input.encounterId) {
    const encounter =
      await repo.findEncounterById(
        input.encounterId
      );

    if (!encounter)
      throw {
        statusCode: 404,
        message: "Encounter not found",
      };

    if (
      encounter.patientId !== input.patientId
    )
      throw {
        statusCode: 400,
        message:
          "Encounter does not belong to patient",
      };

    if (
      encounter.clinicId !== input.clinicId
    )
      throw {
        statusCode: 403,
        message: "Forbidden",
      };

    if (encounter.status !== "open")
      throw {
        statusCode: 400,
        message: "Encounter is closed",
      };
  }

  return repo.createVaccination(input);
};

export const listVaccinations = (
  patientId: string,
  clinicId?: string
) => {
  return repo.findByPatient(
    patientId,
    clinicId
  );
};

export const declineVaccination = async (
  id: string,
  clinicId?: string
) => {
  const vaccination =
    await repo.findById(id, clinicId);

  if (!vaccination)
    throw {
      statusCode: 404,
      message: "Vaccination not found",
    };

  if (vaccination.status !== "active")
    throw {
      statusCode: 400,
      message:
        "Only active vaccinations can be declined",
    };

  return repo.updateStatus(
    id,
    "declined"
  );
};

export const completeVaccination = async (
  id: string,
  clinicId?: string
) => {
  const vaccination =
    await repo.findById(id, clinicId);

  if (!vaccination)
    throw {
      statusCode: 404,
      message: "Vaccination not found",
    };

  if (vaccination.status !== "active")
    throw {
      statusCode: 400,
      message:
        "Only active vaccinations can be completed",
    };

  return repo.completeVaccination(id);
};