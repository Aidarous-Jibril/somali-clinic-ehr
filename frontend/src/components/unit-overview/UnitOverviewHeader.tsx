// src/components/unit-overview/UnitOverviewHeader.tsx

type Props = {
  onAdmitClick: () => void;
};

export function UnitOverviewHeader({ onAdmitClick }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Unit overview</h1>
        <p className="text-xs text-gray-600">
          All current inpatients on this ward / unit (for example Stroke ward).
        </p>
      </div>

      <button
        type="button"
        onClick={onAdmitClick}
        className="h-9 rounded bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        + Admit patient
      </button>
    </div>
  );
}
