// src/features/patient-overview/helpers.ts
import type { FluidBalanceDayModel } from "./dialogs/FluidBalanceDetailsDialog";
import { LAB_ALIASES, LAB_CATALOG } from "./mockData";
import type { ClinicalLogEntry, ClinicalParameterName } from "./types";


/* ---------- Clinical helpers ----------- */
export const calcAlert = (
  name: ClinicalParameterName,
  rawValue: string
): boolean => {
  if (name !== "NEWS2") return false;
  const n = Number(rawValue);
  return !Number.isNaN(n) && n >= 5;
};


export const latestEntry = (
  logs: Record<ClinicalParameterName, ClinicalLogEntry[]>,
  name: ClinicalParameterName
) => {
  const list = logs[name] ?? [];

  if (!list.length) return undefined;

  return [...list].sort(
    (a, b) =>
      new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  )[0];
};


export const mapBackendToUIName = (name: string): ClinicalParameterName => {
  switch (name) {
    case "NEWS2":
      return "NEWS2";
    case "respiratory_rate":
      return "Respiratory rate";
    case "spo2":
      return "SpO₂";
    case "pulse":
      return "Pulse";
    case "blood_pressure":
      return "Blood pressure";
    case "temperature":
      return "Body temperature";
    case "consciousness":
      return "AVPU";
    default:
      return name as ClinicalParameterName;
  }
};

export const toDisplayValue = (
  name: ClinicalParameterName,
  entry?: ClinicalLogEntry
) => {
  if (!entry) return "-";
  switch (name) {
    case "Respiratory rate":
      return `${entry.value} / min`;
    case "SpO₂":
      return `${entry.value} % (${entry.note ?? "0 L"})`;
    case "Pulse":
      return `${entry.value} / min`;
    case "Blood pressure":
      return `${entry.value} mmHg`;
    case "Body temperature":
      return `${entry.value} °C`;
    default:
      return entry.value;
  }
};


/* ---------- Fluid balance details mock ----------- */

export const FLUID_SLOTS = [
  { key: "08:00–08:59", label: "08:00–08:59" },
  { key: "12:00–12:59", label: "12:00–12:59" },
  { key: "20:00–20:59", label: "20:00–20:59" },
];

export function makeFluidDayMock(args: {
  title: string;
  oralMl: number;
  medFluidMl: number;
  totalOutMl: number;
  planned: { name: string; volumeMl?: number | null; isStarred?: boolean }[];
}): FluidBalanceDayModel {
  const totalIn = args.oralMl + args.medFluidMl;
  const total = totalIn - args.totalOutMl;

  return {
    title: args.title,
    slots: FLUID_SLOTS,
    rows: [
      { kind: "section", label: "Fluids in" },
      {
        kind: "row",
        label: "Oral (Intake)",
        volumeMl: args.oralMl,
        kcal: args.oralMl ? 15 : 0,
        slots: {
          "08:00–08:59": null,
          "12:00–12:59": args.oralMl || null,
          "20:00–20:59": null,
        },
      },
      { kind: "total", label: "Total fluids in", volumeMl: totalIn, kcal: 15, strong: true },
      { kind: "section", label: "Fluids out" },
      { kind: "total", label: "Total balance", volumeMl: total, kcal: 15, strong: true },
    ],
    plannedMedicationFluids: args.planned,
  };
}


/* ------ Calc Fluid Chart Max ---------- */
export const calcFluidChartMax = (entries: { intakeMl: number; outputMl: number }[]) =>
  Math.max(...entries.flatMap(e => [e.intakeMl, e.outputMl]), 1);

import type { LabMeta } from "./types";

export function getLabMeta(testName: string): LabMeta | undefined {
  if (LAB_CATALOG[testName]) return LAB_CATALOG[testName];

  const alias = LAB_ALIASES[testName];
  if (alias) return LAB_CATALOG[alias];

  return undefined;
}


/* ---- Date & number helpers (Fluid / forms) ---------- */
export const pad2 = (n: number) => String(n).padStart(2, "0");

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export const nowHHmm = () => {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

export const splitMeasuredAt = (measuredAt: string) => {
  const [date, time] = measuredAt.split(" ");
  return {
    date: date ?? todayISO(),
    time: (time ?? nowHHmm()).slice(0, 5),
  };
};

export const toNumberOrZero = (s: string) => {
  const v = Number(String(s).replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

export const formatBalanceMl = (ml: number) => {
  const sign = ml >= 0 ? "+" : "−";
  return `${sign}${Math.abs(ml).toLocaleString("sv-SE")} ml`;
};

/* ------ Format Medication Dose ---------- */
export const formatMedicationDose = (item: any) => {
  const freq = item.frequency?.replaceAll("_", " ");
  if (!freq) return item.dose;

  const alreadyIncluded = item.dose?.toLowerCase().includes(freq);
  return alreadyIncluded ? item.dose : `${item.dose} (${freq})`;
};

/* ---------- Referral helpers ---------- */
export const parseReferralDetails = (value?: string) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    try {
      const fixed = value.trim();

      const normalized = fixed.startsWith("{")
        ? fixed
        : `{${fixed}}`;

      return JSON.parse(normalized);
    } catch {
      return null;
    }
  }
};

export const prettifyReferralType = (value?: string) => {
  if (!value) return "-";

  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const yesNo = (value?: boolean) => {
  if (value === undefined || value === null) return "-";
  return value ? "Yes" : "No";
};