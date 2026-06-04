// src/components/unit-overview/ActiveContactsTable.tsx

import { useMemo } from "react";
import { Link } from "react-router-dom";

import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HubIcon from "@mui/icons-material/Hub";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import type { Inpatient, PlannedDischargeStatus, } from "../../features/unit-overview/types";

import { formatDateTime } from "../../utils/dateFormat";

// ------------------------------------------------------
// Types
// ------------------------------------------------------

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

// ------------------------------------------------------
// Constants
// ------------------------------------------------------

const headers = [
  "Bed / Room",
  "Phone / ID",
  "Name",
  "EWS",
  "Ward",
  "Start date",
  "Team",
  "Coordination",
  "Planned discharge",
  "Planned transfer",
];

const normalizeBed = (value?: string | null) =>
  (value ?? "").toLowerCase().replace(/\s+/g, "").trim();

const getPatientPath = (patient: Inpatient) =>
  `/patients/${encodeURIComponent(patient.patientId || patient.id)}`;

const getRowClass = (index: number) =>
  `${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`;

const getEwsClass = (score: number) => {
  if (score >= 6) return "bg-red-600 text-white";
  if (score >= 3) return "bg-yellow-400 text-black";
  return "bg-green-500 text-white";
};

const renderDischargeIcon = (status?: PlannedDischargeStatus) => {
  switch (status) {
    case "safe":
      return <CheckCircleIcon fontSize="small" className="text-green-600" />;

    case "possible":
      return <HelpOutlineIcon fontSize="small" className="text-orange-500" />;

    case "notEvaluated":
      return <HelpOutlineIcon fontSize="small" className="text-gray-400" />;

    default:
      return null;
  }
};

// ------------------------------------------------------
// Component
// ------------------------------------------------------

export const ActiveContactsTable = ({
  inpatients,
  allBeds,
  showEmptyBeds,
  onRowClick,
  onRowContextMenu,
  onOpenCoordination,
}: Props) => {
  const patientByBed = useMemo(
    () =>
      new Map(
        inpatients.map((patient) => [
          normalizeBed(patient.bed),
          patient,
        ])
      ),
    [inpatients]
  );

  const beds = useMemo(
    () =>
      showEmptyBeds
        ? allBeds
        : [...new Set(inpatients.map((p) => p.bed))],
    [showEmptyBeds, allBeds, inpatients]
  );

  return (
    <div className="overflow-auto rounded border border-gray-300 bg-white">
      <table className="min-w-full border-collapse text-xs">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((title) => (
              <th
                key={title}
                className="border border-gray-200 px-2 py-1 text-left"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {beds.map((bedCode, index) => {
            const patient = patientByBed.get(normalizeBed(bedCode));
            const rowClass = getRowClass(index);

            if (!patient) {
              return (
                <tr key={bedCode} className={rowClass}>
                  <td className="border px-2 py-1">{bedCode}</td>
                  <td
                    colSpan={9}
                    className="border px-2 py-1 italic text-gray-400"
                  >
                    Empty bed
                  </td>
                </tr>
              );
            }

            const patientPath = getPatientPath(patient);

            return (
              <tr
                key={bedCode}
                className={`${rowClass} cursor-pointer`}
                onClick={() => onRowClick?.(patient)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onRowContextMenu?.(event, patient);
                }}
              >
                <td className="border px-2 py-1">{patient.bed}</td>

                <td className="border px-2 py-1">
                  <Link
                    to={patientPath}
                    className="text-blue-700 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {patient.nationalId}
                  </Link>
                </td>

                <td className="border px-2 py-1">
                  <Link
                    to={patientPath}
                    className="text-blue-700 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {patient.name}
                  </Link>
                </td>

                <td className="border px-2 py-1 text-center">
                  {patient.ews !== undefined ? (
                    <span
                      className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded text-[11px] font-semibold ${getEwsClass(
                        patient.ews
                      )}`}
                    >
                      {patient.ews}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="border px-2 py-1">{patient.ward}</td>
                <td className="border px-2 py-1">{patient.startDate}</td>
                <td className="border px-2 py-1">{patient.team}</td>

                <td className="border px-2 py-1 text-center">
                  <Tooltip title="Coordination">
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCoordination?.(patient);
                      }}
                    >
                      <HubIcon
                        fontSize="small"
                        className={
                          patient.coordination?.hasCase
                            ? "text-blue-700"
                            : "text-gray-400"
                        }
                      />
                    </button>
                  </Tooltip>
                </td>

                <td className="border px-2 py-1">
                  {patient.plannedDischarge ? (
                    <span className="inline-flex items-center gap-1">
                      {formatDateTime(
                        patient.plannedDischarge.dateTime
                      )}
                      {renderDischargeIcon(
                        patient.plannedDischarge.status
                      )}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-400">
                      <WarningAmberIcon fontSize="small" />
                      No plan
                    </span>
                  )}
                </td>

                <td className="border px-2 py-1">
                  {patient.plannedTransfer ? (
                    <span className="inline-flex items-center gap-1 text-blue-700">
                      <CompareArrowsIcon fontSize="small" />
                      {formatDateTime(
                        patient.plannedTransfer.dateTime
                      )}{" "}
                      • {patient.plannedTransfer.unit}
                    </span>
                  ) : (
                    "-"
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