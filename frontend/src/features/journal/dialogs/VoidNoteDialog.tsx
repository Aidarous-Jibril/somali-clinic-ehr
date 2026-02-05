import { useState } from "react";

type Props = {
  open: boolean;
  noteTitle?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export function VoidNoteDialog({ open, noteTitle, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[520px] max-w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold">Cancel note (Makulera)</div>
          {noteTitle ? <div className="text-xs text-gray-600 mt-0.5">{noteTitle}</div> : null}
        </div>

        <div className="p-4">
          <div className="text-sm text-gray-700 mb-2">
            Enter a reason for cancelling (voiding) this note.
          </div>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Wrong patient"
            className="w-full min-h-[120px] rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="px-4 py-3 border-t flex justify-end gap-2 bg-white">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(reason);
              setReason("");
            }}
            className="rounded px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm void
          </button>
        </div>
      </div>
    </div>
  );
}
