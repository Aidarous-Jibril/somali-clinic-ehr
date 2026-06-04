// src/components/unit-overview/UnitOverviewTabs.tsx
import {
  UNIT_OVERVIEW_TABS,
  type UnitOverviewTabKey,
} from "../../features/unit-overview/unitOverviewConstants";

type Props = {
  value: UnitOverviewTabKey;
  onChange: (tab: UnitOverviewTabKey) => void;
};

export function UnitOverviewTabs({ value, onChange }: Props) {
  const base = "rounded-t border border-b-0 px-3 py-1.5 text-sm";
  const active = "border-gray-300 bg-white font-medium";
  const inactive =
    "border-transparent bg-transparent text-gray-500 hover:bg-gray-100";

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-2 text-sm">
        {UNIT_OVERVIEW_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`${base} ${value === t.key ? active : inactive}`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
