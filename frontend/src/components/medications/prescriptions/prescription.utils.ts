// prescription.utils.ts

import type { PrescriptionStatus } from "../../../features/medications/types";

export function getPrescriptionStatus(
  startDate?: string | null
): PrescriptionStatus {
  return startDate ? "active" : "notStarted";
}
