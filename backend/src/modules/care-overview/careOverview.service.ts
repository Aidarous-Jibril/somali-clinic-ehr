import * as repo from "./careOverview.repository.js";

const toDateKey = (date: Date) =>
  date.toISOString().slice(0, 10);

export const getCareOverviewForPatient = async ( patientId: string ) => {
  const encounters = await repo.findPatientEncounters(patientId);

  return encounters.map((encounter) => ({
    id: encounter.id,

    date: toDateKey(encounter.startedAt),

    category:
      encounter.type === "inpatient"
        ? "inpatient"
        : "outpatient",

    visitType:
      encounter.type === "inpatient"
        ? "Inpatient care"
        : encounter.type === "emergency"
        ? "Emergency visit"
        : "Outpatient care",

    unit: encounter.clinic.name,

    responsible: "Assigned staff",

    role: "Doctor",
  }));
};