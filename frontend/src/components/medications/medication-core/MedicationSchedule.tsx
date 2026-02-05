// src/components/medications/medication-core/MedicationSchedule.tsx

import { useEffect, useMemo, useRef } from "react";
import { Tooltip } from "@mui/material";

import type {
  MedicationEvent,
  MedicationScheduleRow,
  TimeRangeKey,
} from "../../../features/medications/types";

import {
  clamp,
  parseDateSafe,
  formatDay,
  formatTime,
  startOfDay,
} from "./medicationSchedule.utils";

/* ============================================================================
 * Types
 * ========================================================================== */

interface MedicationScheduleProps {
  rows: MedicationScheduleRow[];
  rangeMinutes: number;
  timeRange: TimeRangeKey;
  onChangeTimeRange: (v: TimeRangeKey) => void;
  rowHeight: number;
  hoveredMedicationId: string | null;

  getMedicationEvents: (medId: string) => MedicationEvent[];
  getMedicationName: (medId: string) => string;
}

/* ============================================================================
 * Component
 * ========================================================================== */

export default function MedicationSchedule({
  rows,
  rangeMinutes,
  timeRange,
  onChangeTimeRange,
  rowHeight,
  hoveredMedicationId,
  getMedicationEvents,
  getMedicationName,
}: MedicationScheduleProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* ------------------------------------------------------------------------
   * Timeline sizing
   * ---------------------------------------------------------------------- */

  const pxPerMinute = useMemo(() => {
    if (rangeMinutes <= 60) return 10;
    if (rangeMinutes <= 24 * 60) return 1;
    if (rangeMinutes <= 7 * 24 * 60) return 0.25;
    return 0.1;
  }, [rangeMinutes]);

  const anchorStart = useMemo(
    () => startOfDay(new Date("2024-12-11T00:00:00")),
    []
  );

  const timelineWidth = Math.max(
    900,
    Math.round(rangeMinutes * pxPerMinute)
  );

  /* ------------------------------------------------------------------------
   * Ticks
   * ---------------------------------------------------------------------- */

  const ticks = useMemo(() => {
    const stepMin =
      rangeMinutes <= 60
        ? 15
        : rangeMinutes <= 24 * 60
        ? 120
        : rangeMinutes <= 7 * 24 * 60
        ? 360
        : 1440;

    const out: { x: number; label: string; dayLabel?: string }[] = [];

    for (let m = 0; m <= rangeMinutes; m += stepMin) {
      const d = new Date(anchorStart.getTime() + m * 60_000);
      out.push({
        x: Math.round(m * pxPerMinute),
        label: formatTime(d),
        dayLabel: m === 0 || d.getHours() === 0 ? formatDay(d) : undefined,
      });
    }

    return out;
  }, [anchorStart, rangeMinutes, pxPerMinute]);

  /* ------------------------------------------------------------------------
   * Auto-scroll on hover
   * ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!hoveredMedicationId || !scrollRef.current) return;

    const events = getMedicationEvents(hoveredMedicationId)
      .map((e) => ({ ...e, d: parseDateSafe(e.at) }))
      .filter((x): x is MedicationEvent & { d: Date } => Boolean(x.d));

    if (!events.length) return;

    const startMs = anchorStart.getTime();
    const endMs = startMs + rangeMinutes * 60_000;

    const target =
      events.find(
        (e) => e.d.getTime() >= startMs && e.d.getTime() <= endMs
      ) ?? events[0];

    const minutesFromStart =
      (target.d.getTime() - startMs) / 60_000;
    const x = minutesFromStart * pxPerMinute;

    const el = scrollRef.current;
    const desired = x - el.clientWidth * 0.25;
    const maxScroll = Math.max(0, timelineWidth - el.clientWidth);

    el.scrollTo({
      left: clamp(desired, 0, maxScroll),
      behavior: "smooth",
    });
  }, [
    hoveredMedicationId,
    anchorStart,
    rangeMinutes,
    pxPerMinute,
    timelineWidth,
    getMedicationEvents,
  ]);

  /* ------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------- */

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="text-sm font-semibold">
          Schedule <span className="text-gray-500 font-normal">(v2 mock)</span>
        </div>

        <div className="flex gap-2">
          {(["2y", "1y", "1m", "1w", "1d", "1h", "15m"] as TimeRangeKey[]).map(
            (k) => (
              <button
                key={k}
                onClick={() => onChangeTimeRange(k)}
                className={
                  "rounded px-2 py-1 text-sm " +
                  (k === timeRange
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900")
                }
              >
                {k}
              </button>
            )
          )}
        </div>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="overflow-x-auto">
        <div style={{ width: timelineWidth }} className="relative">
          {/* Axis */}
          <div className="relative border-b bg-white" style={{ height: 54 }}>
            {ticks.map((t) => (
              <div key={t.x} className="absolute top-0" style={{ left: t.x }}>
                <div className="h-[54px] w-px bg-gray-200" />
                <div className="absolute top-2 -translate-x-1/2 text-xs text-gray-500">
                  {t.dayLabel}
                </div>
                <div className="absolute bottom-2 -translate-x-1/2 text-xs text-gray-500">
                  {t.label}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((r) =>
            r.type === "group" ? (
              <div
                key={r.key}
                className="bg-gray-50 border-b"
                style={{ height: rowHeight }}
              />
            ) : (
              <div
                key={r.key}
                className={
                  "relative border-b " +
                  (hoveredMedicationId === r.med.id
                    ? "bg-blue-50"
                    : "bg-white")
                }
                style={{ height: rowHeight }}
              >
                {getMedicationEvents(r.med.id)
                  .map((e) => ({ ...e, d: parseDateSafe(e.at) }))
                  .filter(
                    (x): x is MedicationEvent & { d: Date } => Boolean(x.d)
                  )
                  .map((ev, idx) => {
                    const x =
                      ((ev.d.getTime() - anchorStart.getTime()) /
                        60_000) *
                      pxPerMinute;

                    return (
                      <Tooltip
                        key={idx}
                        title={`${getMedicationName(
                          r.med.id
                        )} ${formatDay(ev.d)} ${formatTime(ev.d)}`}
                        arrow
                      >
                        <div
                          className="absolute top-1/2 -translate-y-1/2 rounded border bg-white px-3 py-1 shadow-sm"
                          style={{ left: x }}
                        >
                          {ev.label}
                        </div>
                      </Tooltip>
                    );
                  })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
