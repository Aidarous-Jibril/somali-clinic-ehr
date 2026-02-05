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
/* UI-only helpers                                                            */
/* -------------------------------------------------------------------------- */

/** Maps internal status → human readable label */
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
  /* Derived rows                                                             */
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
      return flat.filter((r) => r.status === "active");
    }

    if (filter === "notStarted") {
      return flat.filter((r) => r.status === "notStarted");
    }

    return flat;
  }, [groups, filter]);

  /* ------------------------------------------------------------------------ */
  /* Totals (summary counts)                                                   */
  /* ------------------------------------------------------------------------ */

  const totals = useMemo(() => {
    const all = groups.reduce((sum, g) => sum + g.items.length, 0);

    const active = groups.reduce(
      (sum, g) =>
        sum + g.items.filter((m) => Boolean(m.startDate)).length,
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
      {/* Top summary */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-gray-900">
          Prescription overview
        </div>

        <div className="inline-flex overflow-hidden rounded border border-gray-300 bg-white text-[12px]">
          <button
            className={
              "px-3 py-1 " +
              (filter === "all"
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50")
            }
            onClick={() => setFilter("all")}
          >
            All ({totals.all})
          </button>

          <button
            className={
              "px-3 py-1 " +
              (filter === "active"
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50")
            }
            onClick={() => setFilter("active")}
          >
            Active ({totals.active})
          </button>

          <button
            className={
              "px-3 py-1 " +
              (filter === "notStarted"
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50")
            }
            onClick={() => setFilter("notStarted")}
          >
            Not started ({totals.notStarted})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="h-[470px] overflow-auto rounded border border-gray-200">
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="text-gray-600">
              <th className="border-b border-gray-200 px-2 py-1 text-left font-normal">
                Medication
              </th>
              <th className="border-b border-gray-200 px-2 py-1 text-left font-normal">
                Dosing
              </th>
              <th className="border-b border-gray-200 px-2 py-1 text-left font-normal">
                Group
              </th>
              <th className="w-28 border-b border-gray-200 px-2 py-1 text-left font-normal">
                Start
              </th>
              <th className="w-24 border-b border-gray-200 px-2 py-1 text-left font-normal">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 bg-white"
              >
                <td className="px-2 py-1">
                  <div className="font-medium text-gray-900">
                    {row.name}
                    {presentation === "large" && row.strength
                      ? `, ${row.strength}`
                      : ""}
                  </div>
                </td>

                <td className="px-2 py-1 text-gray-700">
                  {row.dosingText}
                </td>

                <td className="px-2 py-1 text-gray-600">
                  {row.groupTitle}
                </td>

                <td className="px-2 py-1 text-gray-600">
                  {row.startDate ?? "—"}
                </td>

                <td className="px-2 py-1">
                  <span
                    className={
                      "rounded px-2 py-0.5 text-[10px] " +
                      (row.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600")
                    }
                  >
                    {STATUS_LABEL[row.status]}
                  </span>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-sm text-gray-500"
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
