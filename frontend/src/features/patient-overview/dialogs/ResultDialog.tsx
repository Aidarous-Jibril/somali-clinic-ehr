import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    value: string;
    unit?: string;
    flag: "normal" | "high" | "low" | "critical";
  }) => void;
};

export const ResultDialog: React.FC<Props> = ({
  open,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [flag, setFlag] = useState<"normal" | "high" | "low" | "critical">("normal");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[420px] rounded bg-white p-4 shadow-lg">
        <h3 className="mb-3 text-sm font-semibold">Enter Lab Result</h3>

        <textarea
          className="mb-2 w-full rounded border p-2 text-xs"
          placeholder="Result text..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <input
          className="mb-2 w-full rounded border p-2 text-xs"
          placeholder="Unit (optional)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <select
          className="mb-4 w-full rounded border p-2 text-xs"
          value={flag}
          onChange={(e) =>
            setFlag(e.target.value as "normal" | "high" | "low" | "critical")
          }
        >
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="low">Low</option>
          <option value="critical">Critical</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="text-xs text-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="rounded bg-blue-600 px-3 py-1 text-xs text-white"
            onClick={() => {
              if (!value.trim()) return;
              onSave({ value, unit, flag });
              setValue("");
              setUnit("");
              setFlag("normal");
            }}
          >
            Save Result
          </button>
        </div>
      </div>
    </div>
  );
};