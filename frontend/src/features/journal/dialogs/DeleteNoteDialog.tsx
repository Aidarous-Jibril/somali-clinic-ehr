type Props = {
  open: boolean;
  noteTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteNoteDialog({
  open,
  noteTitle,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[520px] max-w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold">Delete note</div>
          {noteTitle ? (
            <div className="text-xs text-gray-600 mt-0.5">{noteTitle}</div>
          ) : null}
        </div>

        <div className="p-4 text-sm text-gray-700">
          This will permanently remove the note from the list. Are you sure?
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
              console.log("DELETE CLICKED");
              onConfirm();
            }}
            className="rounded px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
