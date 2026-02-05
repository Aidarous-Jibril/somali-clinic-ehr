// src/components/medications/MedicationsToolbar.tsx
import { MenuItem, Select } from "@mui/material";
import type { PresentationMode } from "../../../features/medications/types";

export function MedicationsToolbar({
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
    <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Presentation:</span>
        <div className="inline-flex overflow-hidden rounded border border-gray-300">
          <button
            className={"px-3 py-1 text-[12px] " + (mode === "small" ? "bg-blue-600 text-white" : "bg-white")}
            onClick={() => onModeChange("small")}
            type="button"
          >
            Small
          </button>
          <button
            className={"px-3 py-1 text-[12px] " + (mode === "large" ? "bg-blue-600 text-white" : "bg-white")}
            onClick={() => onModeChange("large")}
            type="button"
          >
            Large
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-600">Sort by:</span>
        <Select
          size="small"
          value={sort}
          onChange={(e) => onSortChange(String(e.target.value))}
          sx={{ height: 30, fontSize: 12, minWidth: 220 }}
        >
          <MenuItem value="nameAsc">Medication name (A–Z)</MenuItem>
          <MenuItem value="nameDesc">Medication name (Z–A)</MenuItem>
          <MenuItem value="startDateDesc">Start date (newest first)</MenuItem>
          <MenuItem value="startDateAsc">Start date (oldest first)</MenuItem>
        </Select>
      </div>
    </div>
  );
}
