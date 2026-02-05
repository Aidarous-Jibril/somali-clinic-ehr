// src/components/unit-overview/UnitOverviewFilters.tsx
import {
  MEDICAL_RESPONSIBLE_UNIT_OPTIONS,
  WARD_UNIT_FILTER_OPTIONS,
} from "../../features/unit-overview/constants";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  showEmptyBeds: boolean;
  onToggleEmptyBeds: (value: boolean) => void;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function UnitOverviewFilters({ showEmptyBeds, onToggleEmptyBeds }: Props) {
  return (
    <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2">
      <div className="flex flex-wrap items-center gap-3">
        {/* Medical responsible unit */}
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500">
            Medical responsible unit
          </span>
          <select className="h-8 min-w-40 rounded border border-gray-300 bg-white px-2 text-xs">
            {MEDICAL_RESPONSIBLE_UNIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}> {opt} </option>
            ))}
          </select>
        </div>

        {/* Ward / unit */}
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500">Ward / Unit</span>
          <select className="h-8 min-w-40 rounded border border-gray-300 bg-white px-2 text-xs">
            {WARD_UNIT_FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle: empty beds */}
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            className="h-3 w-3"
            checked={showEmptyBeds}
            onChange={(e) => onToggleEmptyBeds(e.target.checked)}
          />
          Show empty beds
        </label>

        {/* Placeholder action */}
        <button
          type="button"
          className="ml-auto h-8 rounded border border-gray-400 bg-white px-4 text-xs font-medium hover:bg-gray-100"
        >
          Filter
        </button>
      </div>
    </div>
  );
}
