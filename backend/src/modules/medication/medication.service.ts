import * as repo from "./medication.repository.js";
import { CreateMedicationInput } from "./medication.schema.js";
import {
  MedicationStatus,
  MedicationDoseStatus,
} from "@prisma/client";
import { prisma } from "../../config/prisma.js";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getScheduledTimes(frequency: string): string[] {
  switch (frequency) {
    case "once_daily":
      return ["08:00"];

    case "twice_daily":
      return ["06:00", "18:00"];

    case "three_times_daily":
      return ["08:00", "14:00", "20:00"];

    case "four_times_daily":
      return ["06:00", "12:00", "18:00", "22:00"];

    case "as_needed":
      return [];

    default:
      return ["08:00"];
  }
}

/**
 * Extract treatment duration from dosing text.
 *
 * Supported examples:
 * - "2 tablets x 4 in 7 d"      -> 7
 * - "1 tablet in 10 days"       -> 10
 * - "500 mg for 5 days"         -> 5
 *
 * If no duration is found, defaults to 1 day.
 */
function getDurationDays(dosingText?: string | null): number {
  if (!dosingText) {
    return 1;
  }

  const normalized = dosingText.trim().toLowerCase();

  const patterns = [
    /\bin\s*(\d+)\s*d\b/,       // in 7 d
    /\bin\s*(\d+)\s*day\b/,     // in 7 day
    /\bin\s*(\d+)\s*days\b/,    // in 7 days
    /\bfor\s*(\d+)\s*d\b/,      // for 7 d
    /\bfor\s*(\d+)\s*day\b/,    // for 7 day
    /\bfor\s*(\d+)\s*days\b/,   // for 7 days
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);

    if (!match) {
      continue;
    }

    const days = Number(match[1]);

    if (Number.isInteger(days) && days > 0) {
      return days;
    }
  }

  // Default to 1 day if no duration is found
  return 1;
}

/**
 * Build a scheduled date for a specific time and day offset.
 *
 * dayOffset:
 * - 0 = today
 * - 1 = tomorrow
 * - 2 = day after tomorrow
 */
function buildScheduledDate(
  time: string,
  dayOffset = 0
): Date {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);

  return date;
}

/* -------------------------------------------------------------------------- */
/* Create Medication                                                          */
/* -------------------------------------------------------------------------- */

export const createMedication = async (
  input: CreateMedicationInput
) => {
  // Ensure dosingText is always populated
  const payload = {
    ...input,
    dosingText:
      input.dosingText?.trim() || input.dose,
  };

  // 1. Create medication
  const medication = await repo.createMedication(payload);

  // 2. PRN medications do not receive scheduled doses
  if (payload.frequency === "as_needed") {
    return medication;
  }

  // 3. Determine daily schedule times
  const times = getScheduledTimes(String(payload.frequency));

  // 4. Determine treatment duration
  const durationDays = getDurationDays(payload.dosingText);

  // 5. Build all scheduled doses
  const dosesToCreate = [];

  for (let day = 0; day < durationDays; day++) {
    for (let i = 0; i < times.length; i++) {
      const time = times[i];

      dosesToCreate.push({
        medicationId: medication.id,
        scheduledDate: buildScheduledDate(time, day),
        label: "Scheduled dose",
        status: MedicationDoseStatus.planned,
        tooltip: `Day ${day + 1}, Dose ${i + 1}`,
        isPrn: false,
      });
    }
  }

  // 6. Bulk insert scheduled doses
  if (dosesToCreate.length > 0) {
    await prisma.medicationDose.createMany({
      data: dosesToCreate,
    });
  }

  // 7. Return created medication
  return medication;
};

/* -------------------------------------------------------------------------- */
/* List Medications                                                           */
/* -------------------------------------------------------------------------- */

export const listMedications = (patientId: string, clinicId: string) => {
  return repo.findMedicationsByPatient(patientId, clinicId);
};

/* -------------------------------------------------------------------------- */
/* Status Actions                                                             */
/* -------------------------------------------------------------------------- */

export const stopMedication = (medicationId: string) => {
  return repo.updateStatus(
    medicationId,
    MedicationStatus.ended
  );
};

export const pauseMedication = (medicationId: string) => {
  return repo.updateStatus(
    medicationId,
    MedicationStatus.paused
  );
};

export const resumeMedication = (medicationId: string) => {
  return repo.updateStatus(
    medicationId,
    MedicationStatus.active
  );
};

/* -------------------------------------------------------------------------- */
/* Favorites                                                                  */
/* -------------------------------------------------------------------------- */

export const listFavorites = () => {
  return repo.findFavorites();
};