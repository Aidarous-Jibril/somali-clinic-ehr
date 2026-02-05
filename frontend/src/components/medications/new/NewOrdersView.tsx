import { useEffect, useMemo, useState } from "react";
import { TextField } from "@mui/material";
import { FavoritesTable } from "./FavoritesTable";
import { TreatmentInfoPanel } from "./TreatmentInfoPanel";
import { OrderPreview } from "./OrderPreview";
import { favoriteTemplatesMock } from "../../../features/medications/mockData";

type Props = {
  onSign: (templateId: string) => void;
  onSignAndOpenList: (templateId: string) => void;
};

export function NewOrdersView({ onSign, onSignAndOpenList }: Props) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    favoriteTemplatesMock[0]?.id ?? null
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return favoriteTemplatesMock;
    return favoriteTemplatesMock.filter((r) =>
      `${r.treatmentReason} ${r.templateName} ${r.product} ${r.form} ${r.strength} ${r.dosing}`
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  // If the user filters and the currently selected row disappears,
  // auto-select the first visible row so "Sign" always works.
  useEffect(() => {
    if (!rows.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId) {
      setSelectedId(rows[0].id);
      return;
    }
    const stillVisible = rows.some((r) => r.id === selectedId);
    if (!stillVisible) setSelectedId(rows[0].id);
  }, [rows, selectedId]);

  const selected = useMemo(
    () => rows.find((x) => x.id === selectedId) ?? null,
    [rows, selectedId]
  );

  const canSign = !!selected?.id;

  return (
    <div className="h-full flex flex-col gap-3 p-3">
      {/* top search row */}
      <div className="grid gap-2 md:grid-cols-[1fr_320px]">
        <div className="rounded border border-gray-200 bg-white p-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs text-gray-600">Search for</div>
            <TextField
              size="small"
              placeholder="Fritextsök: Mall, produkt, generika, ATC-kod…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
            />
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-white p-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">Filter results (mock)</div>
            <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* main grid */}
      <div className="grid flex-1 gap-3 md:grid-cols-[1.35fr_0.65fr] min-h-0">
        <div className="min-h-0">
          <FavoritesTable
            rows={rows}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
          />
        </div>

        <div className="min-h-0 overflow-auto">
          <TreatmentInfoPanel />
        </div>
      </div>

      {/* bottom preview + actions */}
      <div className="rounded border border-gray-200 bg-white p-3">
        <OrderPreview selected={selected} />

        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs">
            Order details…
          </button>

          <button
            className={
              "rounded border px-3 py-1 text-xs " +
              (canSign ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100 text-gray-400")
            }
            onClick={() => {
              if (!selected?.id) return;
              console.log("[NewOrdersView] Sign & open list:", selected.id);
              onSignAndOpenList(selected.id);
            }}
            disabled={!canSign}
          >
            Sign and open the list
          </button>

          <button
            className={
              "rounded px-3 py-1 text-xs text-white " +
              (canSign ? "bg-blue-600" : "bg-blue-300")
            }
            onClick={() => {
              if (!selected?.id) return;
              console.log("[NewOrdersView] Sign:", selected.id);
              onSign(selected.id);
            }}
            disabled={!canSign}
          >
            Sign
          </button>
        </div>
      </div>
    </div>
  );
}
