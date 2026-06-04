import React, { useState } from "react";

type LabFlag = "normal" | "high" | "low" | "critical";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    value: string;
    unit?: string;
    flag: LabFlag;
    comment?: string;
  }) => Promise<void>;
};

const ResultModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [flag, setFlag] = useState<LabFlag>("normal");
  const [comment, setComment] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!value) {
      setError("Value is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSubmit({ value, unit, flag, comment});

      setValue("");
      setUnit("");
      setFlag("normal");
      setComment("");

      onClose();
      } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save result"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 w-[400px] space-y-3">
        <h2 className="text-lg font-semibold">Enter Lab Result</h2>

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Result value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Unit (optional)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        {/* FLAG SELECT (same as old UI) */}
        <select
          className="w-full border px-3 py-2 rounded"
          value={flag}
          onChange={(e) => setFlag(e.target.value as LabFlag)}
        >
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="low">Low</option>
          <option value="critical">Critical</option>
        </select>

        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save Result"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;