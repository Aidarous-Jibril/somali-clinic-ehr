// src/components/medications/nutrition/NutritionProductsView.tsx
import { useMemo, useState } from "react";
import { NutritionDetailsDialog } from "./NutritionDetailsDialog";
import { nutritionProductsMock } from "../../../features/medications/mockData";
import type { NutritionPrescription, NutritionStatusFilter } from "../../../features/medications/types";

function parseDateOnly(d: string) {
  // expects "YYYY-MM-DD"
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
}

function extractDatePart(prescribedAt: string) {
  // "YYYY-MM-DD HH:mm" -> "YYYY-MM-DD"
  return prescribedAt.split(" ")[0];
}

/******* Component  ****/
export function NutritionProductsView({
  from,
  to,
  status,
}: {
  from: string;
  to: string;
  status: NutritionStatusFilter;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const rows = useMemo(() => {
    const fromD = parseDateOnly(from);
    const toD = parseDateOnly(to);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return nutritionProductsMock.filter((x) => {
      const prescribedDate = parseDateOnly(extractDatePart(x.prescribedAt));
      const inRange = prescribedDate >= fromD && prescribedDate <= toD;

      const validUntil = x.validUntil ? parseDateOnly(x.validUntil) : null;
      const isExpired = validUntil ? validUntil < today : false;

      const statusOk =
        status === "all" ? true : status === "valid" ? !isExpired : status === "expired" ? isExpired : true;

      return inRange && statusOk;
    });
  }, [from, to, status]);

  const selected: NutritionPrescription | null = rows.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="text-gray-600">
              <th className="w-8 border-b border-gray-200 px-2 py-2 text-left font-normal"></th>
              <th className="w-32 border-b border-gray-200 px-2 py-2 text-left font-normal">Prescribed</th>
              <th className="border-b border-gray-200 px-2 py-2 text-left font-normal">Product</th>
              <th className="border-b border-gray-200 px-2 py-2 text-left font-normal">Description</th>
              <th className="w-24 border-b border-gray-200 px-2 py-2 text-left font-normal">Article no</th>
              <th className="w-40 border-b border-gray-200 px-2 py-2 text-left font-normal">Product area</th>
              <th className="w-28 border-b border-gray-200 px-2 py-2 text-left font-normal">Valid until</th>
              <th className="w-56 border-b border-gray-200 px-2 py-2 text-left font-normal">Prescriber</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-sm text-gray-600">
                  No nutrition prescriptions in this period.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const active = r.id === selectedId;
                return (
                  <tr
                    key={r.id}
                    className={"cursor-pointer border-b border-gray-100 " + (active ? "bg-blue-50" : "bg-white hover:bg-gray-50")}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <td className="px-2 py-2">
                      <input type="checkbox" checked={active} readOnly />
                    </td>
                    <td className="px-2 py-2 text-gray-700">{r.prescribedAt}</td>
                    <td className="px-2 py-2 font-medium text-gray-900">{r.productName}</td>
                    <td className="px-2 py-2 text-gray-700">{r.description ?? "—"}</td>
                    <td className="px-2 py-2 text-gray-700">{r.articleNo ?? "—"}</td>
                    <td className="px-2 py-2 text-gray-700">{r.productArea ?? "—"}</td>
                    <td className="px-2 py-2 text-gray-700">{r.validUntil ?? "—"}</td>
                    <td className="px-2 py-2 text-gray-700">{r.prescriber ?? "—"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* bottom action bar (Cosmic-style) */}
      <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <button className="h-8 rounded border border-gray-300 bg-white px-3 text-[12px] hover:bg-gray-50">
            Print…
          </button>
          <button className="h-8 rounded border border-gray-300 bg-white px-3 text-[12px] hover:bg-gray-50">
            National medication list
          </button>
          <button
            disabled={!selected}
            className="h-8 rounded border border-gray-300 bg-white px-3 text-[12px] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            End prescription
          </button>
          <button
            disabled={!selected}
            className="h-8 rounded border border-gray-300 bg-white px-3 text-[12px] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <div className="flex gap-2">
          <button
            disabled={!selected}
            onClick={() => setDetailsOpen(true)}
            className="h-8 rounded border border-gray-300 bg-white px-3 text-[12px] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Show details
          </button>
          <button
            disabled={!selected}
            className="h-8 rounded border border-gray-300 bg-white px-3 text-[12px] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to cart
          </button>
        </div>
      </div>

      <NutritionDetailsDialog open={detailsOpen} onClose={() => setDetailsOpen(false)} item={selected} />
    </div>
  );
}
