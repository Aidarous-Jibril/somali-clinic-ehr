//src/lib/rbac.ts
import type { AuthUser } from "../context/AuthContext";

export type AppPermission =
  | "dashboard:view"
  | "patients:view"
  | "appointments:view"
  | "unit:view"
  | "sampling:view"
  | "radiology:view"
  | "consents:view";

const permissionMap: Record<AppPermission, string[]> = {
  "dashboard:view": [
    "SuperAdmin",
    "ClinicAdmin",
    "Doctor",
    "Nurse",
    "Lab",
    "Radiology",
    "Physiotherapist",
    "OccupationalTherapist",
    "Dietitian",
    "SpeechTherapist",
    "Midwife",
    "Other",
  ],

  "patients:view": [
    "SuperAdmin",
    "ClinicAdmin",
    "Doctor",
    "Nurse",
    "Physiotherapist",
    "OccupationalTherapist",
    "Dietitian",
    "SpeechTherapist",
    "Midwife",
  ],

  "appointments:view": [
    "Doctor",
    "Nurse",
    "ClinicAdmin",
  ],

  "unit:view": [
    "SuperAdmin",
    "ClinicAdmin",
    "Doctor",
    "Nurse",
  ],

  "sampling:view": [
    "Lab",
  ],

  "radiology:view": [
    "Radiology",
  ],

  "consents:view": [
    "Doctor",
    "Nurse",
    "Midwife",
    "ClinicAdmin",
  ],
};

export function hasPermission(
  user: AuthUser | null,
  permission: AppPermission
) {
  if (!user) return false;
  return permissionMap[permission].includes(user.role);
}