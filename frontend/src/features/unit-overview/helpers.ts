// src/features/unit-overview/helpers.ts

import type { CoordinationData } from "./types";

export const normalize = (value: string) =>
  value.trim().toLowerCase();

export const makeFreshCoordinationForm = (
  source?: CoordinationData
): CoordinationData => ({
  infoSharingConsent:
    source?.infoSharingConsent ?? "notAsked",

  coordinationNeeded:
    source?.coordinationNeeded ?? "notAsked",

  sipConsent:
    source?.sipConsent ?? "notAsked",

  adminComment:
    source?.adminComment ?? "",

  recipients:
    (source?.recipients ?? []).map((r) => ({ ...r })),
});