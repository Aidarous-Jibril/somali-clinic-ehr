// src/components/medications/vaccinations/VaccinationsTimeline.tsx
import { formatDateTime } from "../../../utils/dateFormat";
import type { VaccinationRecord, } from "../../../features/medications/types";

interface Props {
  vaccinations: VaccinationRecord[];
  selectedVaccination?: VaccinationRecord | null;
}

export function VaccinationsTimeline({ vaccinations, selectedVaccination = null, }: Props) {
  const items = selectedVaccination ? [selectedVaccination] : vaccinations;

  return (
    <div className="h-full rounded border border-gray-300 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Vaccinations timeline
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        {items.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            No vaccinations registered.
          </div>
        ) : (
          items.map((vaccination) => (
            <div
              key={vaccination.id}
              className="rounded border border-gray-200 bg-white p-3"
            >
              <div className="font-medium text-gray-900">
                {vaccination.vaccineName}
              </div>

              <div className="mt-1 text-sm text-gray-600">
                {formatDateTime(vaccination.administeredAt)}
              </div>

              {vaccination.dose && (
                <div className="mt-1 text-sm text-gray-600">
                  Dose: {vaccination.dose}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}