// src/features/journal/dialogs/ReopenTableDialog.tsx
type ReopenTableDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ReopenTableDialog({
  open,
  onClose,
  onConfirm,
}: ReopenTableDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[420px] max-w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold">Fråga</div>
        </div>

        <div className="p-4 text-sm text-gray-700">
          Vill du återöppna journaltabellen?
        </div>

        <div className="px-4 py-3 border-t flex justify-end gap-2 bg-white">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
          >
            Nej
          </button>
          <button
            onClick={onConfirm}
            className="rounded px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            Ja
          </button>
        </div>
      </div>
    </div>
  );
}
