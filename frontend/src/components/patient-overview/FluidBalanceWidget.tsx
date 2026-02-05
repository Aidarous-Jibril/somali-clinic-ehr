// src/components/patient-overview/FluidBalanceWidget.tsx
import React from "react";
import { IconButton, Tooltip } from "@mui/material";

import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import type { FluidBalanceEntry } from "../../features/patient-overview/types";
import { calcFluidChartMax } from "../../features/patient-overview/helpers";

/* ========================================================
 * PROPS
 * ====================================================== */

type Props = {
  entries: FluidBalanceEntry[];
  onAddClick: () => void;
  onOpenDetails?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

/* ========================================================
 * COMPONENT
 * ====================================================== */

export const FluidBalanceWidget: React.FC<Props> = ({
  entries,
  onAddClick,
  onOpenDetails,
  onPrev,
  onNext,
}) => {
  /* ----------------------------
   * Derived values
   * -------------------------- */

  const chartMax = calcFluidChartMax(entries);

  /* ======================================================
   * RENDER
   * ====================================================== */

  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2 text-[13px] font-semibold">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={onOpenDetails}
          title="Open fluid balance details"
        >
          <WaterDropIcon fontSize="small" />
          <span>Fluid balance</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-[11px] hover:bg-gray-100">
            My unit
          </button>

          <Tooltip title="Register fluid values">
            <IconButton
              size="small"
              sx={{ color: "#1d4ed8" }}
              onClick={onAddClick}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </header>

      {/* Clickable body → opens details */}
      <button
        type="button"
        className="block w-full text-left"
        onClick={onOpenDetails}
        aria-label="Open fluid balance details"
      >
        <div className="px-3 pt-3 pb-2">
          {entries.length === 0 ? (
            <p className="text-[11px] text-gray-500">
              No fluid balance entries registered yet.
            </p>
          ) : (
            <div className="flex items-end justify-between gap-3">
              {/* Previous */}
              <button
                type="button"
                className="flex h-16 w-4 items-center justify-center text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev?.();
                }}
                aria-label="Previous day"
              >
                ◀
              </button>

              {/* Chart */}
              <div className="flex flex-1 items-end justify-around gap-4">
                {entries.map((entry) => {
                  const intakeHeight = Math.max(
                    18,
                    (entry.intakeMl / chartMax) * 80
                  );
                  const outputHeight = Math.max(
                    18,
                    (entry.outputMl / chartMax) * 80
                  );

                  return (
                    <div
                      key={entry.id}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="flex h-24 items-end gap-2">
                        <div
                          className="w-7 rounded-t bg-cyan-400"
                          style={{ height: `${intakeHeight}px` }}
                          title={`Intake: ${entry.intakeMl} ml`}
                        />
                        <div
                          className="w-7 rounded-t bg-rose-400"
                          style={{ height: `${outputHeight}px` }}
                          title={`Output: ${entry.outputMl} ml`}
                        />
                      </div>

                      <div className="text-[10px] text-gray-700">
                        {entry.intakeMl} ml in
                      </div>
                      <div className="text-[10px] text-gray-700">
                        {entry.outputMl} ml out
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next */}
              <button
                type="button"
                className="flex h-16 w-4 items-center justify-center text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
                }}
                aria-label="Next day"
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        {entries.length > 0 && (
          <div className="grid grid-cols-2 gap-2 px-4 pb-3 pt-1 text-center">
            {entries.map((entry) => (
              <div key={entry.id} className="text-[11px]">
                <div className="text-gray-500">
                  {entry.label} {entry.period}
                </div>
                <div className="font-semibold">
                  Balance: {entry.balance}
                </div>
              </div>
            ))}
          </div>
        )}
      </button>
    </section>
  );
};
