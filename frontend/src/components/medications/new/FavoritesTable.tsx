import { Star } from "lucide-react";
import type { FavoriteTemplate } from "../../../features/medications/types";

export function FavoritesTable({
  rows,
  selectedId,
  onSelect,
}: {
  rows: FavoriteTemplate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
        Favorites: {rows.length} Strength
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="text-gray-600">
              <th className="border-b px-2 py-1 text-left font-normal">Indication</th>
              <th className="border-b px-2 py-1 text-left font-normal">Template name</th>
              <th className="border-b px-2 py-1 text-left font-normal">Product</th>
              <th className="border-b px-2 py-1 text-left font-normal">Form</th>
              <th className="border-b px-2 py-1 text-left font-normal">Strength</th>
              <th className="border-b px-2 py-1 text-left font-normal">Dosing</th>
              <th className="border-b px-2 py-1 text-center font-normal w-10">★</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => {
              const sel = r.id === selectedId;
              return (
                <tr
                  key={r.id}
                  className={
                    "cursor-pointer border-b border-gray-100 hover:bg-blue-50 " +
                    (sel ? "bg-blue-50" : "bg-white")
                  }
                  onClick={() => onSelect(r.id)}
                  title="Markera en mall för att ordinera (mock)"
                >
                  <td className="px-2 py-1 text-gray-700">{r.treatmentReason}</td>
                  <td className="px-2 py-1 text-gray-900 font-medium">{r.templateName}</td>
                  <td className="px-2 py-1 text-gray-700">{r.product}</td>
                  <td className="px-2 py-1 text-gray-700">{r.form}</td>
                  <td className="px-2 py-1 text-gray-700">{r.strength}</td>
                  <td className="px-2 py-1 text-gray-700">{r.dosing}</td>
                  <td className="px-2 py-1 text-center">
                    <Star className={"h-4 w-4 inline " + (r.recommended ? "text-amber-500" : "text-gray-300")} />
                  </td>
                </tr>
              );
            })}
            {!rows.length ? (
              <tr>
                <td colSpan={7} className="px-3 py-3 text-gray-500">
                  No Favorites.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
