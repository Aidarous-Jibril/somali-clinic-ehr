// src/components/medications/medication-core/MedicationListTable.tsx
import React from "react";
import { Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import type {
  MedicationGroup,
  PresentationMode,
} from "../../../features/medications/types";

interface MedicationListTableProps {
  groups: MedicationGroup[];
  presentation: PresentationMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MedicationListTable({
  groups,
  presentation,
  selectedId,
  onSelect,
}: MedicationListTableProps) {
  return (
    <div className="p-3">
      {/* Outer card border (same style as Prescription Overview) */}
      <div className="rounded border border-gray-300 bg-white">
        <table className="w-full text-sm">
          {/* Table Header */}
          <thead className="sticky top-0 z-10 bg-gray-100 text-left">
            <tr className="text-gray-700">
              <th className="w-10 px-2 py-2" />
              <th className="px-2 py-2 font-semibold">Medication</th>
              <th className="px-2 py-2 font-semibold">Dosing</th>
              <th className="w-12 px-2 py-2 text-center font-semibold">Σ</th>
              <th className="w-12 px-2 py-2 text-center" />
              <th className="w-32 px-2 py-2 font-semibold">Start</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {groups.map((group) => (
              <React.Fragment key={group.key}>
                {/* Group Header */}
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td
                    colSpan={6}
                    className="px-3 py-2 text-sm font-semibold text-gray-800"
                  >
                    {group.title} [{group.items.length}]
                  </td>
                </tr>

                {/* Medication Rows */}
                {group.items.map((med) => {
                  const isSelected = med.id === selectedId;

                  return (
                    <tr
                      key={med.id}
                      onClick={() => onSelect(med.id)}
                      className={`cursor-pointer border-t border-gray-200 ${
                        isSelected ? "bg-blue-50" : "hover:bg-blue-50"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-2 py-2">
                        <input
                          type="checkbox"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>

                      {/* Medication */}
                      <td className="px-2 py-2">
                        <Tooltip title={med.tooltip || ""} arrow>
                          <div className="font-medium text-gray-900">
                            {med.name}
                            {presentation === "large" && med.strength
                              ? `, ${med.strength}`
                              : ""}
                          </div>
                        </Tooltip>
                      </td>

                      {/* Dosing */}
                      <td className="px-2 py-2 text-gray-700">
                        {med.dosingText || "—"}
                      </td>

                      {/* Sigma */}
                      <td className="px-2 py-2 text-center text-gray-400" />

                      {/* Info Icon */}
                      <td className="px-2 py-2 text-center">
                        <Tooltip title={med.tooltip || ""} arrow>
                          <InfoOutlinedIcon
                            sx={{
                              fontSize: 16,
                              color: "#4b5563",
                            }}
                          />
                        </Tooltip>
                      </td>

                      {/* Start Date */}
                      <td className="px-2 py-2 text-gray-600">
                        {med.startDate || "—"}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Empty State */}
            {groups.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No medications registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}