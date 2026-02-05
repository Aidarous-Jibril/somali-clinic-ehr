// src/components/dashboard/SummaryCard.tsx
import React from "react";
import type { SummaryCardModel } from "../../features/dashboard/types";

type Props = {
  model: SummaryCardModel;
  onOpen?: () => void; // optional (for clickable headers)
};

export const SummaryCard: React.FC<Props> = ({ model, onOpen }) => {
  const clickable = Boolean(onOpen);

  return (
    <section className="rounded border border-gray-300 bg-white">
      <header
        className={`flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-semibold ${
          clickable ? "cursor-pointer hover:bg-gray-100" : ""
        }`}
        onClick={onOpen}
        title={clickable ? model.onOpenLabel ?? "Open" : undefined}
      >
        <span>{model.title}</span>
        {model.totalText && <span className="text-gray-500">{model.totalText}</span>}
      </header>

      {model.rows && (
        <div className="grid grid-cols-[1fr_auto] gap-y-1 px-3 py-2 text-xs">
          {model.rows.map((r) => (
            <React.Fragment key={r.label}>
              <span className={r.muted ? "text-gray-400" : ""}>{r.label}</span>
              <span className={`text-right font-medium ${r.muted ? "text-gray-400" : ""}`}>{r.value}</span>
            </React.Fragment>
          ))}
        </div>
      )}

      {model.bullets && (
        <div className="px-3 py-2 text-xs">
          <ul className="space-y-1">{model.bullets.map((b) => <li key={b}>• {b}</li>)}</ul>
        </div>
      )}

      {model.emptyText && !model.rows && !model.bullets && (
        <div className="px-3 py-4 text-gray-400 text-xs">{model.emptyText}</div>
      )}
    </section>
  );
};
