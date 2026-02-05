// src/components/medications/nutrition/NutritionToolbar.tsx

import type { NutritionStatusFilter } from "../../../features/medications/types";

export function NutritionToolbar({
  from,
  to,
  status,
  onFromChange,
  onToChange,
  onStatusChange,
  onUpdate,
}: {
  from: string;
  to: string;
  status: NutritionStatusFilter;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onStatusChange: (v: NutritionStatusFilter) => void;
  onUpdate: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2">
      <div className="flex items-center gap-2 text-[12px] text-gray-700">
        <span>Prescribed from:</span>
        <input
          type="date"
          className="h-8 rounded border border-gray-300 px-2 text-[12px]"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 text-[12px] text-gray-700">
        <span>To:</span>
        <input
          type="date"
          className="h-8 rounded border border-gray-300 px-2 text-[12px]"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 text-[12px] text-gray-700">
        <span>Show:</span>
        <select
          className="h-8 rounded border border-gray-300 px-2 text-[12px]"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as NutritionStatusFilter)}
        >
          <option value="valid">Valid</option>
          <option value="all">All</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <button
        className="h-8 rounded border border-gray-300 bg-white px-3 text-[12px] hover:bg-gray-50"
        onClick={onUpdate}
      >
        Update
      </button>
    </div>
  );
}
