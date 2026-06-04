// src/features/patient-overview/mappers/clinical.mapper.ts

import type {
  ClinicalLogEntry,
  ClinicalParameter,
  ClinicalParameterName,
} from "../types";

import {
  latestEntry,
  calcAlert,
  toDisplayValue,
  mapBackendToUIName,
} from "../helpers";

export const mapClinicalEntriesToLogs = (
  clinicalEntries: any[]
): Record<ClinicalParameterName, ClinicalLogEntry[]> => {
  const map = {} as Record<ClinicalParameterName, ClinicalLogEntry[]>;

  clinicalEntries.forEach((entry) => {
    const key = mapBackendToUIName(entry.name);

    if (!map[key]) map[key] = [];

    map[key].push({
      dateTime: entry.recordedAt,
      value: entry.value,
      enteredBy: entry.recordedBy,
      note: entry.note,
    });
  });

  return map;
};

export const buildClinicalParameterRows = (
  clinicalLogs: Record<ClinicalParameterName, ClinicalLogEntry[]>
): ClinicalParameter[] => {
  const names: ClinicalParameterName[] = [
    "NEWS2",
    "AVPU",
    "Respiratory rate",
    "SpO₂",
    "Pulse",
    "Blood pressure",
    "Body temperature",
  ];

  return names.map((name) => {
    const latest = latestEntry(clinicalLogs, name);

    return {
      name,
      value: toDisplayValue(name, latest),
      date: latest?.dateTime ?? "-",
      alert: name === "NEWS2" ? calcAlert("NEWS2", latest?.value ?? "") : false,
    };
  });
};
