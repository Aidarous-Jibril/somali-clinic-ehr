// src/components/unit-overview/ActiveContactsTable.tsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HubIcon from "@mui/icons-material/Hub";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import Tooltip from "@mui/material/Tooltip";

import type {
  Inpatient,
  PlannedDischargeStatus,
} from "../../features/unit-overview/types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  inpatients: Inpatient[];
  allBeds: readonly string[];
  showEmptyBeds: boolean;

  onRowClick?: (patient: Inpatient) => void;
  onRowContextMenu?: (
    event: React.MouseEvent<HTMLTableRowElement>,
    patient: Inpatient
  ) => void;
  onOpenCoordination?: (patient: Inpatient) => void;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function dischargeStatusIcon(status: PlannedDischargeStatus | undefined) {
  if (!status) return null;

  switch (status) {
    case "notEvaluated":
      return (
        <HelpOutlineIcon fontSize="small" className="text-gray-400 align-middle" />
      );
    case "possible":
      return (
        <HelpOutlineIcon fontSize="small" className="text-orange-500 align-middle" />
      );
    case "safe":
      return (
        <CheckCircleIcon fontSize="small" className="text-green-600 align-middle" />
      );
    default:
      return null;
  }
}

function getEwsPillClass(score: number) {
  if (score >= 6) return "bg-red-600 text-white";
  if (score >= 3) return "bg-yellow-400 text-black";
  return "bg-green-500 text-white";
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const ActiveContactsTable: React.FC<Props> = ({
  inpatients,
  allBeds,
  showEmptyBeds,
  onRowClick,
  onRowContextMenu,
  onOpenCoordination,
}) => {
  // Beds to show
  const bedsToRender = useMemo(() => {
    if (showEmptyBeds) return allBeds;
    return Array.from(new Set(inpatients.map((p) => p.bed)));
  }, [showEmptyBeds, allBeds, inpatients]);

  // Fast lookup by bed
  const patientByBed = useMemo(() => {
    const map = new Map<string, Inpatient>();
    for (const p of inpatients) map.set(p.bed, p);
    return map;
  }, [inpatients]);

  return (
    <div className="overflow-auto rounded border border-gray-300 bg-white">
      <table className="min-w-full border-collapse text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-200 px-2 py-1 text-left">Bed / Room</th>
            <th className="border border-gray-200 px-2 py-1 text-left">National ID</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Name</th>
            <th className="border border-gray-200 px-2 py-1 text-center">EWS</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Ward</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Start date</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Technical unit</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Team</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Absence</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Activity</th>
            <th className="border border-gray-200 px-2 py-1 text-center">Coordination</th>
            <th className="border border-gray-200 px-2 py-1 text-left">Planned discharge</th>
          </tr>
        </thead>

        <tbody>
          {bedsToRender.map((bedCode, idx) => {
            const patient = patientByBed.get(bedCode) ?? null;

            const rowBaseClasses =
              (idx % 2 === 0 ? "bg-white" : "bg-gray-50") + " hover:bg-blue-50";

            // Empty bed row
            if (!patient) {
              return (
                <tr key={bedCode} className={rowBaseClasses}>
                  <td className="border border-gray-200 px-2 py-1">{bedCode}</td>
                  <td
                    className="border border-gray-200 px-2 py-1 text-gray-400 italic"
                    colSpan={11}
                  >
                    Empty bed
                  </td>
                </tr>
              );
            }

            const patientPath = `/patients/${encodeURIComponent(patient.nationalId)}`;
            const hasPlannedDischarge = Boolean(patient.plannedDischarge);
            const hasCoordinationCase = Boolean(patient.coordination?.hasCase);

            return (
              <tr
                key={bedCode}
                className={rowBaseClasses + " cursor-pointer transition-colors duration-75"}
                onClick={() => onRowClick?.(patient)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onRowContextMenu?.(event, patient);
                }}
              >
                <td className="border border-gray-200 px-2 py-1">{patient.bed}</td>

                <td className="border border-gray-200 px-2 py-1">
                  <Link
                    to={patientPath}
                    className="text-blue-700 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {patient.nationalId}
                  </Link>
                </td>

                <td className="border border-gray-200 px-2 py-1">
                  <Link
                    to={patientPath}
                    className="text-blue-700 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {patient.name}
                  </Link>
                </td>

                <td className="border border-gray-200 px-2 py-1 text-center">
                  {patient.ews !== undefined ? (
                    <span
                      className={
                        "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded text-[11px] font-semibold " +
                        getEwsPillClass(patient.ews)
                      }
                    >
                      {patient.ews}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="border border-gray-200 px-2 py-1">{patient.ward}</td>
                <td className="border border-gray-200 px-2 py-1">{patient.startDate}</td>
                <td className="border border-gray-200 px-2 py-1">{patient.technicalUnit || ""}</td>
                <td className="border border-gray-200 px-2 py-1">{patient.team}</td>
                <td className="border border-gray-200 px-2 py-1">{patient.absence || ""}</td>
                <td className="border border-gray-200 px-2 py-1">{patient.activity || ""}</td>

                {/* Coordination */}
                <td className="border border-gray-200 px-2 py-1 text-center">
                  <Tooltip title={hasCoordinationCase ? "Open coordination" : "Create coordination"}>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded p-1 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCoordination?.(patient);
                      }}
                    >
                      <HubIcon
                        fontSize="small"
                        className={hasCoordinationCase ? "text-blue-700" : "text-gray-400"}
                      />
                    </button>
                  </Tooltip>
                </td>

                {/* Planned discharge */}
                <td className="border border-gray-200 px-2 py-1">
                  {hasPlannedDischarge ? (
                    <span className="inline-flex items-center gap-1">
                      <span>{patient.plannedDischarge!.dateTime}</span>
                      {dischargeStatusIcon(patient.plannedDischarge?.status)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-400">
                      <WarningAmberIcon fontSize="small" />
                      <span>No plan</span>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
