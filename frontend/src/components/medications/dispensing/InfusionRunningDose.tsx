// src/components/medications/dispensing/InfusionRunningDose.tsx
import React, { useMemo } from "react";
import { Tooltip } from "@mui/material";
import { Droplet } from "lucide-react";

import { toMinutes } from "./dispensing.utils";
import type { DoseMeta, DoseRef } from "../../../features/medications/types";

type Props = {
  days: string[];
  dayWidth: number;

  dose: DoseRef;
  med: any | null;
  meta: DoseMeta;

  isSelected: boolean;

  onClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
};

function parseTimeOnly(dtLocal?: string): string | null {
  if (!dtLocal) return null;
  const t = dtLocal.split("T")[1];
  if (!t) return null;
  return t.slice(0, 5); // HH:mm
}

function hhmm(dtLocal?: string) {
  const t = parseTimeOnly(dtLocal);
  return t ?? "";
}

function xFor(date: string, time: string, days: string[], dayWidth: number) {
  const dayIndex = days.indexOf(date);
  if (dayIndex === -1) return null;
  return dayIndex * dayWidth + (toMinutes(time) / (24 * 60)) * dayWidth;
}

/**
 * IMPORTANT:
 * Timeline days is limited (often 1 day mock).
 * If infusionStartAt/EndAt date is outside the current window -> it would "disappear".
 * So we normalize to the dose's schedule date, and only use the TIME from start/end.
 */
function normalizeToDoseDate(doseDate: string, dtLocal?: string): { date: string; time: string } | null {
  const t = parseTimeOnly(dtLocal);
  if (!t) return null;
  return { date: doseDate, time: t };
}

export function InfusionRunningDose({
  days,
  dayWidth,
  dose,
  med,
  meta,
  isSelected,
  onClick,
  onContextMenu,
}: Props) {
  const doseDate = dose.item.date;

  // Use meta start time if present, but ALWAYS on the dose date.
  const start = normalizeToDoseDate(doseDate, meta.infusionStartAt ? String(meta.infusionStartAt) : undefined) ?? {
    date: doseDate,
    time: dose.item.time,
  };

  // If ended, use end time (on dose date). Otherwise compute projected end.
  const ended = !!meta.infusionEndAt && !meta.infusionRunning;
  const endFromMeta =
    normalizeToDoseDate(doseDate, meta.infusionEndAt ? String(meta.infusionEndAt) : undefined) ?? null;

  const startX = xFor(start.date, start.time, days, dayWidth);
  if (startX == null) {
    // fallback: if dose date isn't in window, try use first day to still show something
    const fallbackDay = days[0];
    if (!fallbackDay) return null;
    const fx = xFor(fallbackDay, start.time, days, dayWidth);
    if (fx == null) return null;
    // continue with fallback X
  }

  const computedEnd = useMemo(() => {
    if (endFromMeta) return endFromMeta;

    // running projection (optional)
    if (!meta.infusionRunning) return null;

    const rate = meta.infusionRateMlHr;
    const vol = meta.infusionPreparedMl;
    if (!rate || !vol) return null;

    const minutes = Math.max(1, Math.round((vol / rate) * 60));
    const d = new Date(`${doseDate}T${start.time}:00`);
    if (Number.isNaN(d.getTime())) return null;

    d.setMinutes(d.getMinutes() + minutes);
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return { date: doseDate, time: `${hh}:${mi}` };
  }, [endFromMeta, meta.infusionRunning, meta.infusionRateMlHr, meta.infusionPreparedMl, doseDate, start.time]);

  const startXFinal = xFor(start.date, start.time, days, dayWidth) ?? xFor(days[0], start.time, days, dayWidth);
  if (startXFinal == null) return null;

  const endX = computedEnd ? xFor(computedEnd.date, computedEnd.time, days, dayWidth) : null;
  const width = endX != null ? Math.max(10, endX - startXFinal) : 10;

  const ordered = meta.infusionOrderedMl != null ? meta.infusionOrderedMl : undefined;
  const prepared = meta.infusionPreparedMl != null ? meta.infusionPreparedMl : undefined;
  const rate = meta.infusionRateMlHr != null ? meta.infusionRateMlHr : undefined;

  const startDT = meta.infusionStartAt ? String(meta.infusionStartAt) : `${doseDate}T${dose.item.time}`;
  const endDT = meta.infusionEndAt ? String(meta.infusionEndAt) : undefined;

  const topTimeLine = ended ? `${hhmm(startDT)}  ${hhmm(endDT)}` : hhmm(startDT);

  const lineUnder =
    prepared != null
      ? `${prepared} ml${ordered != null ? ` (${ordered} ml)` : ""}`
      : dose.item.label ?? "";

  const rateText = rate != null ? `${rate} ml/h` : "";

  const tip = [
    `${med?.name ?? "Infusion"}`,
    `Start: ${startDT}`,
    meta.infusionEndAt ? `End: ${String(meta.infusionEndAt)}` : "",
    prepared != null ? `Prepared: ${prepared} ml` : "",
    ordered != null ? `Ordered: ${ordered} ml` : "",
    rate != null ? `Rate: ${rate} ml/h` : "",
    meta.infusionInfusedMl != null ? `Infused: ${meta.infusionInfusedMl} ml` : "",
    meta.comment ? `Note: ${meta.comment}` : "",
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <Tooltip title={tip} arrow placement="top">
      <div
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={
          "absolute top-2 -translate-x-1/2 cursor-pointer select-none " +
          (isSelected ? "ring-2 ring-blue-500 rounded-sm" : "")
        }
        style={{ left: startXFinal }}
      >
        <div className={"text-[10px] " + (ended ? "text-gray-900 font-semibold" : "text-gray-700")}>
          {topTimeLine}
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <Droplet className={"h-4 w-4 " + (ended ? "text-gray-900" : "text-blue-600")} />
          <div className={"font-semibold leading-3 " + (ended ? "text-gray-900" : "text-gray-800")}>
            <div className="flex items-baseline gap-2">
              <span>{lineUnder}</span>
              {rateText ? <span className="font-medium text-gray-600">{rateText}</span> : null}
            </div>
          </div>
        </div>

        {endX != null ? (
          <div className={"mt-1 h-2.5 rounded-sm " + (ended ? "bg-blue-400" : "bg-blue-200")} style={{ width }} />
        ) : null}
      </div>
    </Tooltip>
  );
}
