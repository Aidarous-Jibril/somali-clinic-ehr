import React, { useEffect, useMemo, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { OrderResult, OrderResultCategoryGroup } from "../../features/patient-overview/types";
import { ORDER_CATEGORY_PREFERENCE } from "../../features/patient-overview/constants";
import { getLabMeta } from "../../features/patient-overview/helpers";
import { formatDateTime } from "../../utils/dateFormat";
import LaboratoryResultDialog from "../../features/patient-overview/dialogs/LaboratoryResultDialog";


type Props = {
  results: OrderResult[];
  search: string;
  onSearchChange: (value: string) => void;
};

const groupResults = (
  results: OrderResult[],
  search: string
): OrderResultCategoryGroup[] => {
  const query = search.trim().toLowerCase();

  const filtered = query
    ? results.filter((r) =>
        [r.name, r.category]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(query))
      )
    : results;

  const map = new Map<string, OrderResult[]>();

  filtered.forEach((r) => {
    const key = r.category || "Other";
    map.set(key, [...(map.get(key) ?? []), r]);
  });

  const keys = [...map.keys()].sort((a, b) => {
    const ia = ORDER_CATEGORY_PREFERENCE.indexOf(a);
    const ib = ORDER_CATEGORY_PREFERENCE.indexOf(b);

    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    }

    return a.localeCompare(b);
  });

  return keys.map((category) => ({
    category,
    items: map.get(category) ?? [],
  }));
};

const LaboratoryResultsWidget: React.FC<Props> = ({
  results,
  search,
  onSearchChange,
}) => {
  const groups = useMemo(
    () => groupResults(results, search),
    [results, search]
  );

  const totalFiltered = useMemo(
    () => groups.reduce((sum, g) => sum + g.items.length, 0),
    [groups]
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedResult, setSelectedResult] = useState<OrderResult | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };

      groups.forEach((g) => {
        if (next[g.category] === undefined) {
          next[g.category] = true;
        }
      });

      Object.keys(next).forEach((k) => {
        if (!groups.some((g) => g.category === k)) {
          delete next[k];
        }
      });

      return next;
    });
  }, [groups]);

  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <span className="text-[13px] font-semibold">Lab results</span>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-7 w-32 rounded border border-gray-300 px-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-40"
          />

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <MoreVertIcon fontSize="small" />
          </button>
        </div>
      </header>

      <div className="max-h-64 overflow-auto px-1 py-1">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="text-gray-500">
              <th className="sticky top-0 bg-white px-2 py-1 text-left font-normal">
                Analysis
              </th>

              <th className="sticky top-0 bg-white px-2 py-1 text-left font-normal">
                Value
              </th>

              <th className="sticky top-0 bg-white px-2 py-1 text-left font-normal">
                Result date
              </th>
            </tr>
          </thead>

          <tbody>
            {totalFiltered === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-2 py-4 text-center text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              groups.map((group) => {
                const open = expanded[group.category] ?? true;

                return (
                  <React.Fragment key={group.category}>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="border-y border-gray-200 p-0">
                        <button
                          className="flex w-full items-center gap-2 px-2 py-2 font-semibold hover:bg-gray-100"
                          onClick={() =>
                            setExpanded((prev) => ({
                              ...prev,
                              [group.category]: !prev[group.category],
                            }))
                          }
                        >
                          <span
                            className={
                              open ? "rotate-90 transition-transform" : ""
                            }
                          >
                            ▶
                          </span>

                          {group.category} ({group.items.length})
                        </button>
                      </td>
                    </tr>

                    {open &&
                      group.items.map((r) => {
                        const meta = getLabMeta(r.name);

                        const metaLine =
                          meta && (meta.unit || meta.ref)
                            ? [meta.unit, meta.ref && `Ref ${meta.ref}`]
                                .filter(Boolean)
                                .join(" · ")
                            : "";

                        return (
                          <tr
                            key={r.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedResult(r);
                              setOpenDialog(true);
                            }}
                          >
                            <td className="border-b px-2 py-1">
                              <div>{r.name}</div>

                              {metaLine && (
                                <div className="text-[10px] text-gray-500">
                                  {metaLine}
                                </div>
                              )}
                            </td>

                            <td className="border-b px-2 py-1">
                              <span
                                className={`font-semibold ${
                                  r.flag === "high" ||
                                  r.flag === "critical"
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {r.result}
                                <span className="align-top text-[9px]">*</span>
                              </span>
                            </td>

                            <td className="border-b px-2 py-1 text-gray-600">
                              {formatDateTime(r.date)}
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <LaboratoryResultDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        result={selectedResult}
      />
    </section>
  );
};

export default LaboratoryResultsWidget;