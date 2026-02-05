// src/components/medications/medication-core/MedicationScheduleGrid.tsx
import React, { useMemo } from "react";
import { Tooltip } from "@mui/material";
import type { MedicationGroup, MedicationScheduleItem, AdministrationStatus } from "../../../features/medications/types";

function toMinutes(t: string) {
  const [h, m] = t.split(":").map((n) => Number(n));
  return h * 60 + m;
}

function addDaysISO(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildDayRange(startISO: string, count: number) {
  return Array.from({ length: count }, (_, i) => addDaysISO(startISO, i));
}

function doseKey(medId: string, item: MedicationScheduleItem) {
  // if you have uid in your schedule items, this makes selection stable
  if (item.uid) return `${medId}|${item.uid}`;
  return `${medId}|${item.date}|${item.time}|${item.label ?? ""}`;
}

function normalizeStatus(s?: AdministrationStatus): AdministrationStatus {
  return s ?? "planned";
}

/** Extract a leading number (supports 2, 2.5, 2,5) from labels like "2 tab", "2.5 ml" */
function extractLeadingDoseNumber(label?: string) {
  if (!label) return null;
  const m = label.trim().match(/^(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  return m[1].replace(",", "."); // normalize 2,5 -> 2.5
}

function badgeClass(status: AdministrationStatus) {
  switch (status) {
    case "given":
      return "bg-blue-700 text-white";
    case "prepared":
      return "bg-orange-600 text-white";
    case "selfAdmin":
      return "bg-indigo-600 text-white";
    case "missed":
      return "bg-red-600 text-white";
    case "notNeeded":
    case "skipped":
      return "bg-gray-400 text-white";
    case "planned":
    default:
      return "bg-orange-500 text-white";
  }
}

/** Small 💊 + a tiny badge with the dose number (if present) */
function pillEmojiWithNumber(status: AdministrationStatus, label: string) {
  const n = extractLeadingDoseNumber(label);

  return (
    <span className="relative inline-flex h-4 w-4 items-center justify-center text-[12px] leading-none">
      <span
        className={
          status === "notNeeded" || status === "skipped"
            ? "opacity-50 grayscale"
            : status === "missed"
            ? "opacity-90"
            : ""
        }
        aria-hidden
      >
        💊
      </span>

      {n ? (
        <span
          className={
            "absolute -right-1 -top-1 min-w-[14px] rounded-full px-1 text-[8px] leading-4 " +
            badgeClass(status)
          }
        >
          {n}
        </span>
      ) : null}
    </span>
  );
}

function pillClasses(status: AdministrationStatus, isSelected: boolean) {
  const base =
    "rounded border px-2 py-1 text-[11px] shadow-sm bg-white inline-flex items-center gap-1 whitespace-nowrap";
  const selected = isSelected ? " ring-2 ring-blue-600 bg-blue-50" : "";
  const border =
    status === "missed"
      ? " border-red-300"
      : status === "given"
      ? " border-blue-300"
      : status === "prepared"
      ? " border-orange-300"
      : status === "selfAdmin"
      ? " border-indigo-300"
      : status === "notNeeded" || status === "skipped"
      ? " border-gray-300"
      : " border-gray-300";
  return base + border + selected;
}

export function MedicationScheduleGrid({
  groups,
  selectedMedicationId,
  selectedDoseKey,
  onSelectDose,
  onSkip,
  onPrepare,
  onAdminister,
  onSelfAdmin,
}: {
  groups: MedicationGroup[];
  selectedMedicationId: string | null;

  // like Dispensing view selection
  selectedDoseKey: string | null;
  onSelectDose: (medId: string, item: MedicationScheduleItem) => void;

  // bottom actions
  onSkip: () => void;
  onPrepare: () => void;
  onAdminister: () => void;
  onSelfAdmin: () => void;
}) {
  const allMeds = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // schedule window
  const days = useMemo(() => buildDayRange("2024-12-11", 7), []);
  const dayWidth = 280;
  const rowHeight = 42; // a bit taller to fit time label like Dispensing view

  const width = days.length * dayWidth;

  const scheduleByMed = useMemo(() => {
    const map = new Map<string, MedicationScheduleItem[]>();
    for (const m of allMeds) map.set(m.id, m.schedule ?? []);
    return map;
  }, [allMeds]);

  const hasSelection = !!selectedDoseKey;

  return (
    <div className="relative h-full bg-white">
      {/* ✅ Scroll area (footer is OUTSIDE, so it never hides when scrolling horizontally) */}
      <div className="h-full overflow-x-auto overflow-y-auto pb-16">
        <div style={{ minWidth: width }}>
          {/* timeline header */}
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between px-3 py-2 text-[11px] text-gray-600">
              <div className="font-semibold text-gray-800">Schedule</div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-gray-500">2y</span>
                <span className="text-gray-500">1y</span>
                <span className="text-gray-500">1m</span>
                <span className="font-medium text-gray-700">1w</span>
                <span className="text-gray-500">1d</span>
                <span className="text-gray-500">1h</span>
                <span className="text-gray-500">15m</span>
              </div>
            </div>

            {/* date + tick row */}
            <div className="relative h-10">
              {days.map((d, i) => {
                const baseX = i * dayWidth;
                return (
                  <React.Fragment key={d}>
                    <div className="absolute top-0 h-full border-l border-gray-200" style={{ left: baseX }} />
                    <div className="absolute top-1 text-[10px] text-gray-500" style={{ left: baseX + 8 }}>
                      {d}
                    </div>

                    {["00:00", "08:00", "16:00"].map((t) => {
                      const x = baseX + (toMinutes(t) / (24 * 60)) * dayWidth;
                      return (
                        <div key={d + t} className="absolute top-0 h-full" style={{ left: x }}>
                          <div className="h-full border-l border-gray-100" />
                          <div className="pointer-events-none absolute bottom-1 -translate-x-1/2 text-[10px] text-gray-400">
                            {t}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* rows */}
          <div className="relative">
            {allMeds.map((m) => {
              const isSelectedMed = selectedMedicationId === m.id;
              const items = scheduleByMed.get(m.id) ?? [];

              return (
                <div
                  key={m.id}
                  className={"relative border-b border-gray-100 " + (isSelectedMed ? "bg-blue-50" : "")}
                  style={{ height: rowHeight }}
                >
                  {/* vertical day grid */}
                  {days.map((_, i) => (
                    <div
                      key={m.id + "day" + i}
                      className="absolute top-0 h-full border-l border-gray-50"
                      style={{ left: i * dayWidth }}
                    />
                  ))}

                  {items.map((s, idx) => {
                    const dayIndex = days.indexOf(s.date);
                    if (dayIndex === -1) return null;

                    const x = dayIndex * dayWidth + (toMinutes(s.time) / (24 * 60)) * dayWidth;
                    const k = doseKey(m.id, s);
                    const isDoseSelected = selectedDoseKey === k;

                    const status = normalizeStatus(s.status);

                    const tip =
                      s.tooltip ??
                      `${m.name}${m.strength ? ` ${m.strength}` : ""} — ${s.date} ${s.time} — ${status}`;

                    return (
                      <Tooltip key={k + idx} title={tip} arrow placement="top">
                        <button
                          type="button"
                          onClick={() => onSelectDose(m.id, s)}
                          className="absolute top-1.5 -translate-x-1/2 text-left"
                          style={{ left: x }}
                        >
                          {/* time above marker like Dispensing view */}
                          <div className="mb-0.5 text-center text-[10px] text-gray-500 leading-3">{s.time}</div>

                          <div className={pillClasses(status, isDoseSelected)}>
                            {pillEmojiWithNumber(status, s.label)}
                            <span className={status === "missed" ? "text-red-700 font-semibold" : "text-gray-900 font-medium"}>
                              {s.label}
                            </span>
                          </div>
                        </button>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✅ Footer (always visible) — like Dispensing view */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between px-3 py-2">
          {/* left actions */}
          <div className="flex items-center gap-2">
            <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">Scan</button>
            <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">Handover</button>
            <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">Register…</button>
          </div>

          {/* right actions */}
          <div className="flex items-center gap-2">
            <button
              className={
                "rounded border px-4 py-1 text-sm " +
                (hasSelection ? "border-gray-300 hover:bg-gray-50" : "border-gray-200 text-gray-400")
              }
              disabled={!hasSelection}
              onClick={onSkip}
            >
              Skip
            </button>

            <button
              className={
                "rounded border px-4 py-1 text-sm " +
                (hasSelection ? "border-gray-300 hover:bg-gray-50" : "border-gray-200 text-gray-400")
              }
              disabled={!hasSelection}
              onClick={onPrepare}
            >
              Prepare
            </button>

            <button
              className={
                "rounded px-4 py-1 text-sm " +
                (hasSelection ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-blue-200 text-white")
              }
              disabled={!hasSelection}
              onClick={onAdminister}
            >
              Administer
            </button>

            <button
              className={
                "rounded border px-4 py-1 text-sm " +
                (hasSelection ? "border-gray-300 hover:bg-gray-50" : "border-gray-200 text-gray-400")
              }
              disabled={!hasSelection}
              onClick={onSelfAdmin}
            >
              Self-admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
