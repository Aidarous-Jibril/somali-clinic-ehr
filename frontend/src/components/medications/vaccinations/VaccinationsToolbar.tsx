// src/components/medications/vaccinations/VaccinationsToolbar.tsx

import { MenuItem, Select } from "@mui/material";
import type { PresentationMode } from
  "../../../features/medications/types";

export function VaccinationsToolbar({
  mode,
  onModeChange,
  sort,
  onSortChange,
}: {
  mode: PresentationMode;
  onModeChange: (m: PresentationMode) => void;
  sort: string;
  onSortChange: (s: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b bg-white px-3 py-2 text-xs">
      <span className="text-gray-600">Presentation:</span>

      <div className="inline-flex overflow-hidden rounded border">
        {(["small", "large"] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={
              "px-3 py-1 " +
              (mode === m
                ? "bg-blue-600 text-white"
                : "bg-white")
            }
          >
            {m}
          </button>
        ))}
      </div>

      <span className="text-gray-600">Sort by:</span>

      <Select
        size="small"
        value={sort}
        onChange={(e) => onSortChange(String(e.target.value))}
      >
        <MenuItem value="atcAsc">ATC code (A–Z)</MenuItem>
        <MenuItem value="atcDesc">ATC code (Z–A)</MenuItem>
        <MenuItem value="nameAsc">Vaccine name (A–Z)</MenuItem>
        <MenuItem value="nameDesc">Vaccine name (Z–A)</MenuItem>
      </Select>
    </div>
  );
}
