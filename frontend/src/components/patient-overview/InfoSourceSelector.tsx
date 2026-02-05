// src/components/patient-overview/InfoSourceSelector.tsx
import React from "react";
import type { InfoSource } from "../../features/patient-overview/types";

/* ========================================================
 * PROPS
 * ====================================================== */

type Props = {
  value: InfoSource;
  onChange: (next: InfoSource) => void;
  onUpdate?: () => void;
};

/* ========================================================
 * HELPERS
 * ====================================================== */

const pillClass = (active: boolean) =>
  active
    ? "rounded-full border border-blue-500 bg-blue-500 px-3 py-1 text-[11px] font-medium text-white"
    : "rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] text-gray-700 hover:bg-gray-100";

/* ========================================================
 * COMPONENT
 * ====================================================== */

export const InfoSourceSelector: React.FC<Props> = ({
  value,
  onChange,
  onUpdate,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
      {/* Label */}
      <div className="flex items-center gap-1 text-gray-700">
        <span>Showing patient information from:</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={pillClass(value === "myUnit")}
          onClick={() => onChange("myUnit")}
        >
          My unit
        </button>

        <button
          type="button"
          className={pillClass(value === "myProvider")}
          onClick={() => onChange("myProvider")}
        >
          My provider
        </button>

        <button
          type="button"
          className={pillClass(value === "allProviders")}
          onClick={() => onChange("allProviders")}
        >
          All providers
        </button>

        <button
          type="button"
          className="rounded border border-gray-300 bg-white px-3 py-1 text-[11px] text-gray-700 hover:bg-gray-100"
          onClick={onUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
};
