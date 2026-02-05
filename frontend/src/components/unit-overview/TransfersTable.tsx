// src/components/unit-overview/TransfersTable.tsx
import React, { useMemo } from "react";
import type { Transfer } from "../../features/unit-overview/types";

import { IconButton, Tooltip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  transfers: Transfer[];
  onReserveBedClick?: (transfer: Transfer) => void;
  onTransferNowClick?: (transfer: Transfer) => void;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function directionLabel(direction: Transfer["direction"]) {
  return direction === "outbound" ? "Outbound" : "Inbound";
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const TransfersTable: React.FC<Props> = ({
  transfers,
  onReserveBedClick,
  onTransferNowClick,
}) => {
  const { planned, completedToday } = useMemo(() => {
    const planned = transfers.filter((t) => t.status === "planned");
    const completedToday = transfers.filter((t) => t.status === "completedToday");
    return { planned, completedToday };
  }, [transfers]);

  if (!transfers.length) {
    return (
      <div className="rounded border border-gray-300 bg-white p-4 text-xs text-gray-500">
        No transfers registered for this ward.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded border border-gray-300 bg-white text-xs">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-200 px-2 py-1 text-left">Direction</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Type</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Name</th>
            <th className="border border-gray-200 px-2 py-1 text-left">National ID</th>
            <th className="border border-gray-200 px-2 py-1 text-left">From</th>
            <th className="border border-gray-200 px-2 py-1 text-left">To</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Time</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Bed reserved</th>
            <th className="border border-gray-200 px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* Planned */}
          {planned.length > 0 && (
            <tr className="bg-blue-50 text-[11px] font-semibold text-blue-900">
              <td className="border border-gray-200 px-2 py-1" colSpan={9}>
                Planned transfers ({planned.length})
              </td>
            </tr>
          )}

          {planned.map((t, idx) => {
            const rowClass =
              (idx % 2 === 0 ? "bg-white" : "bg-gray-50") + " hover:bg-blue-50";

            const isInbound = t.direction === "inbound";
            const canTransferNow = isInbound && Boolean(t.bedReserved);

            return (
              <tr key={t.id} className={rowClass}>
                <td className="border border-gray-200 px-2 py-1">{directionLabel(t.direction)}</td>
                <td className="border border-gray-200 px-2 py-1">{t.type}</td>
                <td className="border border-gray-200 px-2 py-1">{t.name}</td>
                <td className="border border-gray-200 px-2 py-1">{t.nationalId}</td>

                <td className="border border-gray-200 px-2 py-1">
                  <div className="font-medium">{t.fromFacility}</div>
                  <div className="text-[11px] text-gray-600">{t.fromUnit}</div>
                </td>

                <td className="border border-gray-200 px-2 py-1">
                  <div className="font-medium">{t.toFacility}</div>
                  <div className="text-[11px] text-gray-600">{t.toUnit}</div>
                </td>

                <td className="border border-gray-200 px-2 py-1">{t.transferTime}</td>
                <td className="border border-gray-200 px-2 py-1">{t.bedReserved || "-"}</td>

                <td className="border border-gray-200 px-2 py-1 text-center">
                  {isInbound ? (
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip title="Reserve bed">
                        <span>
                          <IconButton size="small" onClick={() => onReserveBedClick?.(t)}>
                            <LocalHotelIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title={canTransferNow ? "Transfer now" : "Reserve a bed first"}>
                        <span>
                          <button
                            type="button"
                            disabled={!canTransferNow}
                            className={
                              "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium " +
                              (canTransferNow
                                ? "border-blue-600 text-blue-700 hover:bg-blue-50"
                                : "cursor-not-allowed border-gray-300 text-gray-400")
                            }
                            onClick={() => canTransferNow && onTransferNowClick?.(t)}
                          >
                            <ArrowForwardIcon fontSize="inherit" />
                            Transfer now
                          </button>
                        </span>
                      </Tooltip>
                    </div>
                  ) : (
                    // outbound is read-only in this MVP (logged/referral)
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}

          {/* Completed today */}
          {completedToday.length > 0 && (
            <>
              <tr>
                <td className="border border-gray-200 px-2 py-1" colSpan={9} />
              </tr>

              <tr className="bg-green-50 text-[11px] font-semibold text-green-900">
                <td className="border border-gray-200 px-2 py-1" colSpan={9}>
                  Transfers completed today ({completedToday.length})
                </td>
              </tr>

              {completedToday.map((t, idx) => {
                const rowClass =
                  (idx % 2 === 0 ? "bg-white" : "bg-gray-50") + " hover:bg-green-50";

                return (
                  <tr key={t.id} className={rowClass}>
                    <td className="border border-gray-200 px-2 py-1">{directionLabel(t.direction)}</td>
                    <td className="border border-gray-200 px-2 py-1">{t.type}</td>
                    <td className="border border-gray-200 px-2 py-1">{t.name}</td>
                    <td className="border border-gray-200 px-2 py-1">{t.nationalId}</td>

                    <td className="border border-gray-200 px-2 py-1">
                      <div className="font-medium">{t.fromFacility}</div>
                      <div className="text-[11px] text-gray-600">{t.fromUnit}</div>
                    </td>

                    <td className="border border-gray-200 px-2 py-1">
                      <div className="font-medium">{t.toFacility}</div>
                      <div className="text-[11px] text-gray-600">{t.toUnit}</div>
                    </td>

                    <td className="border border-gray-200 px-2 py-1">{t.transferTime}</td>
                    <td className="border border-gray-200 px-2 py-1">{t.bedReserved || "-"}</td>
                    <td className="border border-gray-200 px-2 py-1 text-center">
                      <span className="text-gray-400">-</span>
                    </td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
