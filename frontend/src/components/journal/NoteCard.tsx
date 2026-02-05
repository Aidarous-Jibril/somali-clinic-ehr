// src/components/journal/NoteCard.tsx
import type { JournalNote } from "../../features/journal/types";

type Props = {
  note: JournalNote;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onOpen?: (id: string) => void;

  // NEW:
  onOpenMenu?: (id: string, anchor: HTMLElement) => void;
};

export function NoteCard({ note, isSelected, onSelect, onOpen, onOpenMenu }: Props) {
  const badge =
    note.status === "Draft"
      ? "bg-yellow-50 text-yellow-800 border-yellow-200"
      : note.status === "Signed"
      ? "bg-green-50 text-green-800 border-green-200"
      : "bg-red-50 text-red-800 border-red-200"; // Voided

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(note.id)}
      onDoubleClick={() => onOpen?.(note.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onOpenMenu?.(note.id, e.currentTarget as HTMLElement);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen?.(note.id);
      }}
      className={[
        "rounded border bg-white p-3 shadow-sm cursor-pointer select-none",
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300",
      ].join(" ")}
      title={note.status === "Draft" ? "Double-click to edit" : "Double-click to view (read-only)"}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">{note.title}</div>
          <div className="text-xs text-gray-600 mt-0.5 truncate">
            {note.author} • {note.unit}
          </div>
        </div>

        <span className={`shrink-0 rounded px-2 py-0.5 text-xs border ${badge}`}>
          {note.status}
        </span>
      </div>

      {note.status === "Voided" ? (
        <div className="mt-2 text-xs text-red-800 whitespace-pre-wrap">
          Makulerings­tidpunkt:{" "}
          {note.voidedAt ? new Date(note.voidedAt).toLocaleString() : "—"}
          {"\n"}
          {note.voidReason ?? ""}
        </div>
      ) : note.content?.trim() ? (
        <div className="mt-2 text-xs text-gray-700 line-clamp-3 whitespace-pre-wrap">
          {note.content}
        </div>
      ) : (
        <div className="mt-2 text-xs text-gray-500 italic">No content yet</div>
      )}
    </div>
  );
}
