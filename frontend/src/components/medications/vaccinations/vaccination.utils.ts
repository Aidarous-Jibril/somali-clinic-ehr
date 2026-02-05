/* -------------------------------------------------------------------------- */
/* Date helpers (pure, testable)                                               */
/* -------------------------------------------------------------------------- */

export function formatDateTime(iso: string) {
  const d = parseDateSafe(iso);
  if (!d) return iso;

  return (
    `${d.getFullYear()}-` +
    `${String(d.getMonth() + 1).padStart(2, "0")}-` +
    `${String(d.getDate()).padStart(2, "0")} ` +
    `${String(d.getHours()).padStart(2, "0")}:` +
    `${String(d.getMinutes()).padStart(2, "0")}`
  );
}

/* -------------------------------------------------------------------------- */
/* Date helpers (pure, safe to reuse)                                          */
/* -------------------------------------------------------------------------- */

export function parseDateSafe(iso: string): Date | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/* -------------------------------------------------------------------------- */
/* Timeline label formatting                                                  */
/* -------------------------------------------------------------------------- */

export function formatYear(d: Date) {
  return String(d.getFullYear());
}

export function formatMonth(d: Date) {
  return d.toLocaleString("en-GB", { month: "short" });
}

export function formatDay(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* -------------------------------------------------------------------------- */
/* Date math helpers                                                          */
/* -------------------------------------------------------------------------- */

export function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

export function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function addMinutes(d: Date, minutes: number) {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() + minutes);
  return x;
}
