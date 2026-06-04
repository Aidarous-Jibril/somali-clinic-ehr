// src/components/medications/vaccinations/VaccinationsTable.tsx

import { formatDateTime } from "../../../utils/dateFormat";
import type { VaccinationRecord } from "../../../features/medications/types";

interface Props {
  vaccinations: VaccinationRecord[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function VaccinationsTable({
  vaccinations,
  selectedId = null,
  onSelect,
}: Props) {
  return (
    <div className="h-full overflow-auto rounded border border-gray-300 bg-white">
      <table className="w-full text-sm">
        {/* Header */}
        <thead className="sticky top-0 z-10 bg-gray-100 text-left">
          <tr className="text-gray-700">
            <th className="px-3 py-2 font-semibold">Vaccine</th>
            <th className="px-3 py-2 font-semibold">Dose</th>
            <th className="px-3 py-2 font-semibold">Status</th>
            <th className="px-3 py-2 font-semibold">Administered At</th>
            <th className="px-3 py-2 font-semibold">Administered By</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {vaccinations.map((vaccination) => {
            const isSelected = vaccination.id === selectedId;

            return (
              <tr
                key={vaccination.id}
                onClick={() => onSelect?.(vaccination.id)}
                className={`border-t border-gray-200 ${
                  onSelect ? "cursor-pointer" : ""
                } ${
                  isSelected
                    ? "bg-blue-50"
                    : onSelect
                    ? "hover:bg-blue-50"
                    : ""
                }`}
              >
                <td className="px-3 py-2 font-medium text-gray-900">
                  {vaccination.vaccineName}
                </td>

                <td className="px-3 py-2 text-gray-700">
                  {vaccination.dose || "—"}
                </td>

                <td className="px-3 py-2">
                  <span className="inline-flex rounded bg-green-100 px-2 py-0.5 text-xs font-medium capitalize text-green-800">
                    {vaccination.status}
                  </span>
                </td>

                <td className="px-3 py-2 text-gray-600">
                  {formatDateTime(vaccination.administeredAt)}
                </td>

                <td className="px-3 py-2 text-gray-600">
                  {vaccination.administeredBy || "—"}
                </td>
              </tr>
            );
          })}

          {vaccinations.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                No vaccinations registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}