// src/components/medications/dispensing/dispensing.utils.ts
import type { DoseRef, Medication, MedicationScheduleItem } from "../../../features/medications/types";

/* ============================= time / date helpers ============================= */

/** Convert "HH:mm" → minutes since midnight (for timeline X-positioning) */
export function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Add N days to an ISO date ("YYYY-MM-DD") and return ISO string */
export function addDaysISO(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Build consecutive ISO dates for timeline headers */
export function buildDayRange(startISO: string, count: number) {
  return Array.from({ length: count }, (_, i) => addDaysISO(startISO, i));
}

/** Pad single digit number → "01" */
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Round current time to nearest X minutes (used for PRN creation) */
export function roundNowTo(minutesStep: number) {
  const d = new Date();
  const ms = minutesStep * 60 * 1000;
  return new Date(Math.round(d.getTime() / ms) * ms);
}

/** Date → "YYYY-MM-DD" */
export function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Date → "HH:mm" */
export function toHHmm(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Date → "YYYY-MM-DDTHH:mm" (for datetime-local inputs) */
export function toDateTimeLocal(d: Date) {
  return `${toISODate(d)}T${toHHmm(d)}`;
}

/** Parse datetime-local string safely (returns null if invalid) */
export function parseDateTimeLocal(v: string): Date | null {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/* ================================== keys ================================== */

/**
 * Stable unique key for a scheduled dose.
 * Used for selection, overrides, meta storage, and maps.
 */
export function doseKey(medId: string, item: MedicationScheduleItem) {
  return `${medId}|${item?.date}|${item?.time}|${item?.label ?? ""}`;
}

/** Key helper when working with DoseRef objects */
export function doseRefKey(d: DoseRef) {
  return doseKey(d.medId, d.item);
}

/* ============================ label formatting ============================ */

/**
 * Split dose labels like:
 * "2.5 ml" → { amount: "2.5", rest: "ml" }
 * Used for nicer timeline rendering.
 */
export function splitDoseLabel(label: string): {
  amount?: string;
  rest?: string;
  raw: string;
} {
  const trimmed = (label ?? "").trim();
  const m = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!m) return { raw: trimmed };
  return { amount: m[1], rest: (m[2] ?? "").trim(), raw: trimmed };
}

/* ============================ directive helpers ============================ */

/** Background stripes for General Directive rows (Cosmic-style cue) */
export function directiveStripeStyle(): React.CSSProperties {
  return {
    backgroundImage:
      "repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.0) 8px, rgba(0,0,0,0.0) 16px)",
  };
}

/** Identify General Directive medications */
export function isDirective(m?: Medication | null) {
  if (!m) return false;
  const name = (m.name ?? "").toLowerCase();
  return m.group === "generalDirective" || name.startsWith("general directive");
}

/* ============================ handover helpers ============================ */

/** Convert DoseRef → Date object (or null if invalid) */
export function doseDateTime(d: DoseRef): Date | null {
  const x = new Date(`${d.item.date}T${d.item.time}`);
  return Number.isNaN(x.getTime()) ? null : x;
}

/** Check if a dose falls within a handover time window */
export function isInHandoverRange(d: DoseRef, fromStr: string, toStr: string) {
  const dt = doseDateTime(d);
  const from = parseDateTimeLocal(fromStr);
  const to = parseDateTimeLocal(toStr);

  // If inputs are invalid, never hide doses
  if (!dt || !from || !to) return true;

  return dt.getTime() >= from.getTime() && dt.getTime() <= to.getTime();
}

/* ============================ display helpers ============================ */

/** Build readable bullet lines for handover notes */
export function buildHandoverLines(
  doses: DoseRef[],
  getMed: (medId: string) => Medication | null
) {
  return doses.map((d) => {
    const med = getMed(d.medId);
    const name = med ? `${med.name}${med.strength ? ` ${med.strength}` : ""}` : d.medId;
    return `- ${name} — ${d.item.date} ${d.item.time} (${d.item.label})`;
  });
}

/* ============================ PRN helpers ============================ */

/**
 * Pure PRN dose factory.
 * Used when adding new PRN doses without mutating existing schedules.
 */
export function createPrnDoseBase(args: {
  now: Date;
  dateFallback: string;
  timeFallback: string;
}): MedicationScheduleItem {
  const { now, dateFallback, timeFallback } = args;

  return {
    date: dateFallback || toISODate(now),
    time: timeFallback || toHHmm(now),
    label: "PRN dose",
    status: "planned",
    tooltip: "PRN dose created (mock)",
  };
}
