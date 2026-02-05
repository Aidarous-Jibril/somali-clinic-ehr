// src/components/patient-overview/ResultsWidget.tsx/**
import React, { useEffect, useMemo, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import type {
  OrderResult,
  OrderResultCategoryGroup,
} from "../../features/patient-overview/types";

import { getLabMeta } from "../../features/patient-overview/helpers";

/* ========== PROPS =========== */

type Props = {
  results: OrderResult[];
  search: string;
  onSearchChange: (value: string) => void;
};


/* ========== CONSTANTS =========== */
const PREFERRED_CATEGORIES = [
  "Chemistry",
  "Hematology",
  "Microbiology",
  "Radiology",
  "Other",
];

/* ========== HELPERS =========== */
const groupResults = (
  results: OrderResult[],
  search: string
): OrderResultCategoryGroup[] => {
  const query = search.trim().toLowerCase();
  const filtered = query
    ? results.filter((r) => r.name.toLowerCase().includes(query))
    : results;

  const map = new Map<string, OrderResult[]>();

  for (const r of filtered) {
    const key = r.category || "Other";
    map.set(key, [...(map.get(key) ?? []), r]);
  }

  const keys = Array.from(map.keys());
  keys.sort((a, b) => {
    const ia = PREFERRED_CATEGORIES.indexOf(a);
    const ib = PREFERRED_CATEGORIES.indexOf(b);
    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    }
    return a.localeCompare(b);
  });

  return keys.map((k) => ({ category: k, items: map.get(k) ?? [] }));
};


/* ========== COMPONENT =========== */
export const ResultsWidget: React.FC<Props> = ({
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

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      for (const g of groups) {
        if (typeof next[g.category] === "undefined") next[g.category] = true;
      }
      for (const key of Object.keys(next)) {
        if (!groups.some((g) => g.category === key)) delete next[key];
      }
      return next;
    });
  }, [groups]);

  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <span className="text-[13px] font-semibold">Lab results</span>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className="h-7 w-32 rounded border border-gray-300 px-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-40"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <MoreVertIcon fontSize="small" />
          </button>
        </div>
      </header>

      {/* Table */}
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
                <td colSpan={3} className="px-2 py-2 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            ) : (
              groups.map((group) => {
                const isOpen = expanded[group.category] ?? true;

                return (
                  <React.Fragment key={group.category}>
                    {/* Category header */}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="border-y border-gray-200 px-0">
                        <button
                          type="button"
                          onClick={() => toggleCategory(group.category)}
                          className="flex w-full items-center gap-2 px-2 py-2 text-left font-semibold hover:bg-gray-100"
                        >
                          <span
                            className={
                              "transition-transform " +
                              (isOpen ? "rotate-90" : "")
                            }
                          >
                            ▶
                          </span>
                          {group.category} ({group.items.length})
                        </button>
                      </td>
                    </tr>

                    {/* Results */}
                    {isOpen &&
                      group.items.map((r, idx) => {
                        const meta = getLabMeta(r.name);
                        const metaLine =
                          meta && (meta.unit || meta.ref)
                            ? [
                                meta.unit,
                                meta.ref ? `Ref ${meta.ref}` : "",
                              ]
                                .filter(Boolean)
                                .join(" · ")
                            : null;

                        return (
                          <tr key={`${group.category}-${idx}`}>
                            <td className="border-b px-2 py-1">
                              <div>
                                <div>{r.name}</div>
                                {metaLine && (
                                  <div className="text-[10px] text-gray-500">
                                    {metaLine}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="border-b px-2 py-1">
                              {r.flag === "high" ||
                              r.flag === "critical" ? (
                                <span className="font-semibold text-red-600">
                                  {r.result}
                                  <span className="align-top text-[9px]">*</span>
                                </span>
                              ) : (
                                r.result
                              )}
                            </td>

                            <td className="border-b px-2 py-1 text-gray-600">
                              {r.date}
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
    </section>
  );
};
