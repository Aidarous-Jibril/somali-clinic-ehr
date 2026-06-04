// src/components/patient-overview/FluidBalanceWidget.tsx
import React, { useState, useMemo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import type { FluidBalanceEntry } from "../../features/patient-overview/types";
import { calcFluidChartMax } from "../../features/patient-overview/helpers";

type Props = {
  entries: FluidBalanceEntry[];
  onAddClick: () => void;
  onOpenDetails?: () => void;
  onSelectIndex?: (index: number) => void; // 🔥 NEW
};

export const FluidBalanceWidget: React.FC<Props> = ({
  entries,
  onAddClick,
  onOpenDetails,
  onSelectIndex,
}) => {
  const [index, setIndex] = useState(0);

  const sortedEntries = useMemo(() => {
    return [...entries];
  }, [entries]);

  const current = sortedEntries[index];

  const chartMax = calcFluidChartMax(sortedEntries);

  const hasPrev = index < sortedEntries.length - 1;
  const hasNext = index > 0;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrev) {
      setIndex((i) => {
        const newIndex = i + 1;
        onSelectIndex?.(newIndex);
        return newIndex;
      });
    }
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext) {
      setIndex((i) => {
        const newIndex = i - 1;
        onSelectIndex?.(newIndex);
        return newIndex;
      });
    }
  };

  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2 text-[13px] font-semibold">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => {
            onSelectIndex?.(index);
            onOpenDetails?.();
          }}
        >
          <WaterDropIcon fontSize="small" />
          <span>Fluid balance</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-[11px]">
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

      {/* Body */}
      <div
        className="block w-full cursor-pointer text-left"
        onClick={() => {
          onSelectIndex?.(index);
          onOpenDetails?.();
        }}
      >
        <div className="px-3 pt-3 pb-2">
          {!current ? (
            <p className="text-[11px] text-gray-500">
              No fluid balance entries registered yet.
            </p>
          ) : (
            <div className="flex items-end justify-between gap-3">
              {/* Prev */}
              <button
                type="button"
                disabled={!hasPrev}
                className={`flex h-16 w-4 items-center justify-center ${
                  hasPrev
                    ? "text-gray-400 hover:text-gray-600"
                    : "text-gray-200 cursor-not-allowed"
                }`}
                onClick={goPrev}
              >
                ◀
              </button>

              {/* Chart */}
              <div className="flex flex-1 justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-24 items-end gap-2">
                    <div
                      className="w-10 rounded-t bg-cyan-400"
                      style={{
                        height: `${Math.max(
                          18,
                          (current.intakeMl / chartMax) * 80
                        )}px`,
                      }}
                    />
                    <div
                      className="w-10 rounded-t bg-rose-400"
                      style={{
                        height: `${Math.max(
                          18,
                          (current.outputMl / chartMax) * 80
                        )}px`,
                      }}
                    />
                  </div>

                  <div className="text-[10px] text-gray-700">
                    {current.intakeMl} ml in
                  </div>
                  <div className="text-[10px] text-gray-700">
                    {current.outputMl} ml out
                  </div>
                </div>
              </div>

              {/* Next */}
              <button
                type="button"
                disabled={!hasNext}
                className={`flex h-16 w-4 items-center justify-center ${
                  hasNext
                    ? "text-gray-400 hover:text-gray-600"
                    : "text-gray-200 cursor-not-allowed"
                }`}
                onClick={goNext}
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        {current && (
          <div className="px-4 pb-3 pt-1 text-center">
            <div className="text-gray-500">
              {current.label} {current.period}
            </div>
            <div className="font-semibold">
              Balance: {current.balance}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};