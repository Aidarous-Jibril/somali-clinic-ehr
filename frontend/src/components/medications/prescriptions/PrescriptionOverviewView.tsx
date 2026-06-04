// src/components/medications/prescriptions/PrescriptionOverviewView.tsx

import { useMemo, useState } from "react";
import type {
  MedicationGroup,
  PrescriptionRow,
  PrescriptionStatus,
  PresentationMode,
} from "../../../features/medications/types";

import { getPrescriptionStatus } from "./prescription.utils";

/* -------------------------------------------------------------------------- */
/* UI Helpers                                                                 */
/* -------------------------------------------------------------------------- */

const STATUS_LABEL: Record<PrescriptionStatus, string> = {
  active: "Active",
  notStarted: "Not started",
};

export function PrescriptionOverviewView({
  groups,
  presentation,
}: {
  groups: MedicationGroup[];
  presentation: PresentationMode;
}) {
  const [filter, setFilter] = useState<
    "all" | "active" | "notStarted"
  >("all");

  /* ------------------------------------------------------------------------ */
  /* Derived Rows                                                             */
  /* ------------------------------------------------------------------------ */

  const rows = useMemo<PrescriptionRow[]>(() => {
    const flat = groups.flatMap((group) =>
      group.items.map((med) => ({
        id: med.id,
        name: med.name,
        strength: med.strength,
        dosingText: med.dosingText,
        startDate: med.startDate,
        groupTitle: group.title,
        status: getPrescriptionStatus(med.startDate),
      }))
    );

    if (filter === "active") {
      return flat.filter((row) => row.status === "active");
    }

    if (filter === "notStarted") {
      return flat.filter((row) => row.status === "notStarted");
    }

    return flat;
  }, [groups, filter]);

  /* ------------------------------------------------------------------------ */
  /* Totals                                                                   */
  /* ------------------------------------------------------------------------ */

  const totals = useMemo(() => {
    const all = groups.reduce(
      (sum, group) => sum + group.items.length,
      0
    );

    const active = groups.reduce(
      (sum, group) =>
        sum +
        group.items.filter((med) => Boolean(med.startDate)).length,
      0
    );

    return {
      all,
      active,
      notStarted: all - active,
    };
  }, [groups]);

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="h-full p-3">
      <div className="h-full rounded border border-gray-300 bg-white overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-3">
          <div className="text-lg font-semibold text-gray-900">
            Prescription overview
          </div>

          <div className="inline-flex overflow-hidden rounded border border-gray-300 bg-white text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={
                "px-3 py-1.5 " +
                (filter === "all"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-700 hover:bg-gray-50")
              }
            >
              All ({totals.all})
            </button>

            <button
              type="button"
              onClick={() => setFilter("active")}
              className={
                "px-3 py-1.5 border-l border-gray-300 " +
                (filter === "active"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-700 hover:bg-gray-50")
              }
            >
              Active ({totals.active})
            </button>

            <button
              type="button"
              onClick={() => setFilter("notStarted")}
              className={
                "px-3 py-1.5 border-l border-gray-300 " +
                (filter === "notStarted"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-700 hover:bg-gray-50")
              }
            >
              Not started ({totals.notStarted})
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-100 text-left">
            <tr className="text-gray-700">
              <th className="px-2 py-2 font-semibold">Medication</th>
              <th className="px-2 py-2 font-semibold">Dosing</th>
              <th className="px-2 py-2 font-semibold">Group</th>
              <th className="w-32 px-2 py-2 font-semibold">Start</th>
              <th className="w-32 px-2 py-2 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                {/* Medication */}
                <td className="px-2 py-2">
                  <div className="font-medium text-gray-900">
                    {row.name}
                    {presentation === "large" && row.strength
                      ? `, ${row.strength}`
                      : ""}
                  </div>
                </td>

                {/* Dosing */}
                <td className="px-2 py-2 text-gray-700">
                  {row.dosingText || "—"}
                </td>

                {/* Group */}
                <td className="px-2 py-2 text-gray-600">
                  {row.groupTitle}
                </td>

                {/* Start */}
                <td className="px-2 py-2 text-gray-600">
                  {row.startDate || "—"}
                </td>

                {/* Status */}
                <td className="px-2 py-2">
                  <span
                    className={
                      "inline-flex rounded px-2 py-0.5 text-xs font-medium " +
                      (row.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600")
                    }
                  >
                    {STATUS_LABEL[row.status]}
                  </span>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No prescriptions match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}