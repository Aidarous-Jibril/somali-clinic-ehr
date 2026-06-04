// src/features/medications/medication.mapper.ts

import type {
  Medication,
  MedicationScheduleItem,
  AdministrationStatus,
} from "./types";

function mapStatus(status?: string): AdministrationStatus {
  switch (status) {
    case "prepared":
      return "prepared";
    case "given":
      return "given";
    case "selfAdmin":
      return "selfAdmin";
    case "skipped":
      return "skipped";
    case "notNeeded":
      return "notNeeded";
    default:
      return "planned";
  }
}

function formatDate(dateIso?: string) {
  if (!dateIso) return new Date().toISOString().slice(0, 10);
  return dateIso.slice(0, 10);
}

function formatTime(dateIso?: string) {
  if (!dateIso) return "08:00";
  return dateIso.slice(11, 16);
}

export function mapMedicationDtoToUi(dto: any): Medication {
  // ---------------------------------------------------------------------------
  // Use REAL backend doses when they exist
  // ---------------------------------------------------------------------------
  let schedule: MedicationScheduleItem[] = (dto.doses ?? []).map(
    (dose: any) => ({
      // IMPORTANT:
      // uid must contain the real MedicationDose.id so actions like
      // skip/prepare/administer call the correct backend endpoint.
      uid: dose.id,

      date: formatDate(dose.scheduledDate),
      time: formatTime(dose.scheduledDate),

      // Show the medication dose (e.g. 1000mg) rather than the time label.
      // The backend label ("08:00") is still available in tooltip if needed.
      label: dto.dose || dose.label || "1 dose",

      tooltip:
        dose.tooltip ||
        `${dto.name} ${dto.dose || ""} • ${formatDate( dose.scheduledDate )} ${formatTime(dose.scheduledDate)} • ${dose.status || "planned"}`,

      status: mapStatus(dose.status),
    })
  );

  // ---------------------------------------------------------------------------
  // Only generate fallback schedule when NO real doses exist
  // ---------------------------------------------------------------------------
  if (schedule.length === 0) {
    const times =
      dto.frequency === "twice_daily"
        ? ["08:00", "20:00"]
        : dto.frequency === "three_times_daily"
        ? ["08:00", "14:00", "20:00"]
        : dto.frequency === "four_times_daily"
        ? ["08:00", "12:00", "16:00", "20:00"]
        : ["08:00"];

    schedule = times.map((time, index) => ({
      uid: `fallback-${dto.id}-${index}`,
      date: "2024-12-11",
      time,
      label: dto.dose || "1 dose",
      status: "planned",
      tooltip: `${dto.name} ${dto.dose || ""} • 2024-12-11 ${time} • planned`,
    }));
  }

  return {
    id: dto.id,

    // Use backend groupType if available
    group: dto.groupType || "current",

    name: dto.name,
    strength: dto.dose,
    dosingText: dto.dosingText || dto.frequency || "",
    startDate: formatDate(dto.createdAt),
    tooltip: dto.indication || dto.name,

    // Real or fallback schedule
    schedule,
  };
}