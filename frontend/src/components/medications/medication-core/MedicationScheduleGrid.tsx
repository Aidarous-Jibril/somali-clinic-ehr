// src/components/medications/medication-core/MedicationScheduleGrid.tsx
import React, { useMemo } from "react";
import { Tooltip } from "@mui/material";
import type {
  MedicationGroup,
  MedicationScheduleItem,
  AdministrationStatus,
} from "../../../features/medications/types";

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
  if (item.uid) return `${medId}|${item.uid}`;
  return `${medId}|${item.date}|${item.time}|${item.label ?? ""}`;
}

function normalizeStatus(
  status?: AdministrationStatus
): AdministrationStatus {
  return status ?? "planned";
}

/** Extract leading number from labels like "2 tab", "2.5 ml", "2,5 ml" */
function extractLeadingDoseNumber(label?: string) {
  if (!label) return null;

  const match = label.trim().match(/^(\d+(?:[.,]\d+)?)/);
  if (!match) return null;

  return match[1].replace(",", ".");
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

/** Small 💊 icon with numeric badge if label begins with a number */
function pillEmojiWithNumber(
  status: AdministrationStatus,
  label: string
) {
  const number = extractLeadingDoseNumber(label);

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

      {number ? (
        <span
          className={
            "absolute -right-1 -top-1 min-w-[14px] rounded-full px-1 text-[8px] leading-4 " +
            badgeClass(status)
          }
        >
          {number}
        </span>
      ) : null}
    </span>
  );
}

function pillClasses(
  status: AdministrationStatus,
  isSelected: boolean
) {
  const base =
    "rounded border px-2 py-1 text-[11px] shadow-sm bg-white inline-flex items-center gap-1 whitespace-nowrap";

  const selected = isSelected
    ? " ring-2 ring-blue-600 bg-blue-50"
    : "";

  const border =
    status === "missed"
      ? " border-red-300"
      : status === "given"
      ? " border-blue-300"
      : status === "prepared"
      ? " border-orange-300"
      : status === "selfAdmin"
      ? " border-indigo-300"
      : " border-gray-300";

  return base + border + selected;
}

interface MedicationScheduleGridProps {
  groups: MedicationGroup[];
  selectedMedicationId: string | null;

  // Selected dose
  selectedDoseKey: string | null;
  onSelectDose: (
    medId: string,
    item: MedicationScheduleItem
  ) => void;

  // Footer actions
  onSkip: () => void;
  onPrepare: () => void;
  onAdminister: () => void;
  onSelfAdmin: () => void;

  // Register medication
  onRegisterMedication: () => void;
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
  onRegisterMedication,
}: MedicationScheduleGridProps) {
  const allMeds = useMemo(
    () => groups.flatMap((group) => group.items),
    [groups]
  );

  // Timeline window (7 days)
  const days = useMemo(
    () => buildDayRange("2024-12-11", 7),
    []
  );

  const dayWidth = 280;
  const rowHeight = 42;
  const width = days.length * dayWidth;

  const scheduleByMed = useMemo(() => {
    const map = new Map<string, MedicationScheduleItem[]>();

    for (const med of allMeds) {
      map.set(med.id, med.schedule ?? []);
    }

    return map;
  }, [allMeds]);

  const hasSelection = !!selectedDoseKey;

  return (
    <div className="relative h-full bg-white">
      {/* Scrollable timeline area */}
      <div className="h-full overflow-x-auto overflow-y-auto pb-16">
        <div style={{ minWidth: width }}>
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between px-3 py-2 text-[11px] text-gray-600">
              <div className="font-semibold text-gray-800">
                Schedule
              </div>

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

            {/* Date + time axis */}
            <div className="relative h-10">
              {days.map((day, i) => {
                const baseX = i * dayWidth;

                return (
                  <React.Fragment key={day}>
                    <div
                      className="absolute top-0 h-full border-l border-gray-200"
                      style={{ left: baseX }}
                    />

                    <div
                      className="absolute top-1 text-[10px] text-gray-500"
                      style={{ left: baseX + 8 }}
                    >
                      {day}
                    </div>

                    {["00:00", "08:00", "16:00"].map((time) => {
                      const x =
                        baseX +
                        (toMinutes(time) / (24 * 60)) *
                          dayWidth;

                      return (
                        <div
                          key={`${day}-${time}`}
                          className="absolute top-0 h-full"
                          style={{ left: x }}
                        >
                          <div className="h-full border-l border-gray-100" />

                          <div className="pointer-events-none absolute bottom-1 -translate-x-1/2 text-[10px] text-gray-400">
                            {time}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Medication rows */}
          <div className="relative">
            {allMeds.map((med) => {
              const isSelectedMedication =
                selectedMedicationId === med.id;

              const scheduleItems =
                scheduleByMed.get(med.id) ?? [];

              return (
                <div
                  key={med.id}
                  className={
                    "relative border-b border-gray-100 " +
                    (isSelectedMedication
                      ? "bg-blue-50"
                      : "")
                  }
                  style={{ height: rowHeight }}
                >
                  {/* Day grid */}
                  {days.map((_, i) => (
                    <div
                      key={`${med.id}-day-${i}`}
                      className="absolute top-0 h-full border-l border-gray-50"
                      style={{ left: i * dayWidth }}
                    />
                  ))}

                  {/* Dose markers */}
                  {scheduleItems.map((item, idx) => {
                    const dayIndex = days.indexOf(item.date);
                    if (dayIndex === -1) return null;

                    const x =
                      dayIndex * dayWidth +
                      (toMinutes(item.time) /
                        (24 * 60)) *
                        dayWidth;

                    const key = doseKey(med.id, item);

                    const isDoseSelected =
                      selectedDoseKey === key;

                    const status = normalizeStatus(
                      item.status
                    );

                    const tooltip =
                      item.tooltip ??
                      `${med.name}${
                        med.strength
                          ? ` ${med.strength}`
                          : ""
                      } — ${item.date} ${item.time} — ${status}`;

                    return (
                      <Tooltip
                        key={`${key}-${idx}`}
                        title={tooltip}
                        arrow
                        placement="top"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onSelectDose(med.id, item)
                          }
                          className="absolute top-1.5 -translate-x-1/2 text-left"
                          style={{ left: x }}
                        >
                          {/* Time */}
                          <div className="mb-0.5 text-center text-[10px] text-gray-500 leading-3">
                            {item.time}
                          </div>

                          {/* Dose pill */}
                          <div
                            className={pillClasses(
                              status,
                              isDoseSelected
                            )}
                          >
                            {pillEmojiWithNumber(
                              status,
                              item.label
                            )}

                            <span
                              className={
                                status === "missed"
                                  ? "text-red-700 font-semibold"
                                  : "text-gray-900 font-medium"
                              }
                            >
                              {item.label}
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

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left actions */}
          <div className="flex items-center gap-2">
            <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
              Scan
            </button>

            <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
              Handover
            </button>

            <button
              type="button"
              className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              onClick={onRegisterMedication}
            >
              Register…
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={
                "rounded border px-4 py-1 text-sm " +
                (hasSelection
                  ? "border-gray-300 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400")
              }
              disabled={!hasSelection}
              onClick={onSkip}
            >
              Skip
            </button>

            <button
              type="button"
              className={
                "rounded border px-4 py-1 text-sm " +
                (hasSelection
                  ? "border-gray-300 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400")
              }
              disabled={!hasSelection}
              onClick={onPrepare}
            >
              Prepare
            </button>

            <button
              type="button"
              className={
                "rounded px-4 py-1 text-sm " +
                (hasSelection
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-blue-200 text-white")
              }
              disabled={!hasSelection}
              onClick={onAdminister}
            >
              Administer
            </button>

            <button
              type="button"
              className={
                "rounded border px-4 py-1 text-sm " +
                (hasSelection
                  ? "border-gray-300 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400")
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

