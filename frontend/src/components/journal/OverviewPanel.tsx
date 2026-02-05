// src/components/journal/components/OverviewPanel.tsx
import type { JournalNote } from "../../features/journal/types";

type Props = {
  searchQuery: string;
  onSearchChange: (v: string) => void;

  notes: JournalNote[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
};

export function OverviewPanel({
  searchQuery,
  onSearchChange,
  notes,
  selectedNoteId,
  onSelectNote,
}: Props) {
  return (
    <div className="min-h-0 flex flex-col">
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="text-sm font-semibold">Overview panel</div>
      </div>

      <div className="px-3 pb-2">
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search…"
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="px-2 pb-2 overflow-auto min-h-0">
        {notes.length === 0 ? (
          <div className="px-2 py-3 text-sm text-gray-600">
            No notes match the filter.
          </div>
        ) : (
          notes.map((n) => {
            const active = n.id === selectedNoteId;
            return (
              <button
                key={n.id}
                onClick={() => onSelectNote(n.id)}
                className={[
                  "w-full text-left rounded px-2 py-2 text-sm border mb-2",
                  active
                    ? "bg-white border-blue-400 shadow-sm"
                    : "bg-gray-50 border-gray-200 hover:bg-white",
                ].join(" ")}
              >
                <div className="font-medium text-gray-900">{n.title}</div>
                <div className="text-xs text-gray-600">
                  {new Date(n.dateTime).toLocaleString()} • {n.author}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
