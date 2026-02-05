// src/components/journal/JournalTableBar.tsx
import { CLOSE_REASON_OPTIONS } from "../../features/journal/mockData";
import type { JournalTable } from "../../features/journal/types";


type Props = {
  tables: JournalTable[];
  selectedTableId: string;
  onSelectTable: (id: string) => void;

  onCloseTable: () => void;
  onReopenTable: () => void;
};

export function JournalTableBar({
  tables,
  selectedTableId,
  onSelectTable,
  onCloseTable,
  onReopenTable,
}: Props) {
  const t = tables.find((x) => x.id === selectedTableId);
  const reasonLabel =
    t?.closeReason ? CLOSE_REASON_OPTIONS.find((x) => x.key === t.closeReason)?.label : null;

  return (
    <div className="px-4 py-2 border-b bg-white flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="text-sm font-semibold whitespace-nowrap">Journal table</div>

        <select
          value={selectedTableId}
          onChange={(e) => onSelectTable(e.target.value)}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm min-w-[260px]"
        >
          {tables.map((x) => (
            <option key={x.id} value={x.id}>
              {x.title} • {x.unit} • {x.status}
            </option>
          ))}
        </select>

        {t?.status === "Closed" ? (
          <div className="text-xs text-gray-600 truncate">
            Ended: {t.closedAt ? new Date(t.closedAt).toLocaleString() : "—"}
            {reasonLabel ? ` • ${reasonLabel}` : ""}
          </div>
        ) : (
          <div className="text-xs text-green-700">Open • You can write a note</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {t?.status === "Open" ? (
          <button
            onClick={onCloseTable}
            className="rounded px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50"
          >
            End
          </button>
        ) : (
          <button
            onClick={onReopenTable}
            className="rounded px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            Open reference
          </button>
        )}
      </div>
    </div>
  );
}
