// src/components/journal/components/ViewTree.tsx
import type { JournalViewItem, JournalViewKey } from "../../features/journal/types";

type Props = {
  items: JournalViewItem[];
  selected: JournalViewKey;
  onSelect: (key: JournalViewKey) => void;
};

export function ViewTree({ items, selected, onSelect }: Props) {
  return (
    <div className="min-h-0 flex flex-col">
      <div className="px-3 py-2 text-sm font-semibold">View tree</div>

      <div className="px-2 pb-2 overflow-auto min-h-0">
        {items.map((item) => {
          const active = item.key === selected;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={[
                "w-full text-left rounded px-2 py-2 text-sm transition-colors",
                active ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-800",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
