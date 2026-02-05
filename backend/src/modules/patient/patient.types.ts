// src/modules/patient/patient.types.ts

/**
 * Core Patient entity (API-level, not Prisma)
 * This mirrors what the frontend needs, not the DB shape.
 */
export type Patient = {
  id: string;
  personalNumber?: string;

  firstName: string;
  lastName: string;
  dateOfBirth: string;

  gender?: "male" | "female" | "other";

  unit: string;

  createdAt: string;
  updatedAt: string;
};

/**
 * Lightweight view model for patient banner
 * (used by PatientBanner + header widgets)
 */
export type PatientBannerDTO = {
  id: string;
  fullName: string;
  age: number;
  unit: string;
};
