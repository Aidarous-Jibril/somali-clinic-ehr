// src/components/medications/dispensing/DispensingTimeline.tsx
import React from "react";
import { toMinutes } from "./dispensing.utils";

export function DispensingTimeline({
  days,
  dayWidth,
  ticks,
  selectionHint,
}: {
  days: string[];
  dayWidth: number;
  ticks: string[];
  selectionHint: string;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-3 py-2 text-[11px] text-gray-600">
        <div className="font-semibold text-gray-800">Dispensing timeline</div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-gray-500">2y</span>
          <span className="text-gray-500">1y</span>
          <span className="text-gray-500">1m</span>
          <span className="text-gray-500">1w</span>
          <span className="font-medium text-gray-700">1d</span>
          <span className="text-gray-500">1h</span>
          <span className="text-gray-500">15m</span>
        </div>
      </div>

      <div className="px-3 pb-2 text-[11px] text-gray-500">{selectionHint}</div>

      <div className="relative h-10">
        {days.map((d, i) => {
          const baseX = i * dayWidth;
          return (
            <React.Fragment key={d}>
              <div
                className="absolute top-0 h-full border-l border-gray-200"
                style={{ left: baseX }}
              />
              <div
                className="absolute top-1 text-[10px] text-gray-500"
                style={{ left: baseX + 8 }}
              >
                {d}
              </div>

              {ticks.map((t) => {
                const x = baseX + (toMinutes(t) / (24 * 60)) * dayWidth;
                return (
                  <div
                    key={d + t}
                    className="absolute top-0 h-full"
                    style={{ left: x }}
                  >
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
  );
}
