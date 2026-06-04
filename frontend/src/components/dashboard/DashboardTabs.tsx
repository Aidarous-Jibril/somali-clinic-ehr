// src/components/dashboard/DashboardTabs.tsx
import React from "react";
import type { DashboardTabKey } from "../../features/dashboard/types";

type Props = {
  value: DashboardTabKey;
  onChange: (tab: DashboardTabKey) => void;
};

export const DashboardTabs: React.FC<Props> = ({ value, onChange }) => {
  const base = "rounded-t border border-b-0 px-3 py-1.5 text-sm";
  const active = "border-gray-300 bg-white font-medium";
  const inactive = "border-transparent bg-transparent text-gray-500 hover:bg-gray-100";

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => onChange("calendar")}
          className={`${base} ${value === "calendar" ? active : inactive}`}
        >
          My calendar
        </button>

        <button
          type="button"
          onClick={() => onChange("patients")}
          className={`${base} ${value === "patients" ? active : inactive}`}
        >
          My patient list
        </button>
      </nav>
    </div>
  );
};