import { prisma } from "../../config/prisma.js";
import { CareContactEntry } from "./careOverview.types.js";

const toDateKey = (d: Date) =>
  d.toISOString().slice(0, 10); // YYYY-MM-DD

export const getCareOverviewForPatient = async (
  patientId: string
): Promise<CareContactEntry[]> => {
  const encounters = await prisma.encounter.findMany({
    where: { patientId },
    include: {
      clinic: true,
    },
    orderBy: { startedAt: "desc" },
  });

  return encounters.map((e) => ({
    id: e.id,
    date: toDateKey(e.startedAt),

    category:
      e.type === "inpatient"
        ? "inpatient"
        : e.type === "outpatient"
        ? "outpatient"
        : "outpatient",

    visitType:
      e.type === "inpatient"
        ? "Inpatient care"
        : e.type === "emergency"
        ? "Emergency visit"
        : "Outpatient care",

    unit: e.clinic.name,
    responsible: "Assigned staff", // later: staff table
    role: "Doctor", // later: role mapping
  }));
};
