// src/features/journal/dialogs/CloseTableDialog.tsx
import { useState } from "react";
import type { JournalCloseReasonKey } from "../types";
import { CLOSE_REASON_OPTIONS } from "../templates/templates";

type CloseTableDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: JournalCloseReasonKey, comment: string) => void;
};

export function CloseTableDialog({
  open,
  onClose,
  onConfirm,
}: CloseTableDialogProps) {
  const [reason, setReason] = useState<JournalCloseReasonKey | "">("");
  const [comment, setComment] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[560px] max-w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold">End journal table</div>
          <div className="text-xs text-gray-600 mt-0.5">
           Enter a termination reason
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Termination reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              {CLOSE_REASON_OPTIONS.map((x) => (
                <option key={x.key} value={x.key}>
                  {x.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-[140px] rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="px-4 py-3 border-t flex justify-end gap-2 bg-white">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={!reason}
            onClick={() => {
              if (!reason) return;
              onConfirm(reason as JournalCloseReasonKey, comment);
              setReason("");
              setComment("");
            }}
            className="rounded px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
