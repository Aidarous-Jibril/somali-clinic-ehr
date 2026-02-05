// src/components/patient-overview/CareOverviewWidget.tsx
import React, { useMemo, useState } from "react";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import type {
  CareContactCategory,
  CareContactEntry,
  CareOverviewDayCell,
} from "../../features/patient-overview/types";

import { CareContactDetailsDialog } from "../../features/patient-overview/dialogs/CareContactDetailsDialog";

/* =============== CONSTANTS / HELPERS (UI ONLY)================= */
const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const pad2 = (n: number) => String(n).padStart(2, "0");

const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const parseDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

// Monday-based week start
const startOfWeekMonday = (d: Date) => {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const categoryClass = (category: CareContactCategory) => {
  switch (category) {
    case "multiple":
      return "bg-gray-800";
    case "inpatient":
      return "bg-teal-500";
    case "outpatient":
      return "bg-orange-500";
    case "secrecy":
      return "bg-red-600";
    default:
      return "bg-gray-200";
  }
};

const formatDateLabel = (d: Date) => {
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const months = ["jan.", "feb.", "mar.", "apr.", "may", "jun", "jul", "aug.", "sep.", "oct.", "nov.", "dec."];

  return `${weekdays[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/* ======= PROPS =========== */

type Props = {
  entries: CareContactEntry[];
};

/* ======= COMPONENT =========== */
export const CareOverviewWidget: React.FC<Props> = ({ entries }) => {

  /* -------- UI state--------- */
 const [yearsBack, setYearsBack] = useState(2);
 const [selectedKey, setSelectedKey] = useState<string | null>(null);
 
 /* -------- Date range --------- */
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const range = useMemo(() => {
    const start = new Date(today);
    start.setFullYear(start.getFullYear() - yearsBack);

    const end = new Date(today);
    end.setFullYear(end.getFullYear() + 1);

    return { start, end };
  }, [today, yearsBack]);


 /* -------- Group entries by day --------- */
  const entriesByDay = useMemo(() => {
    const map = new Map<string, CareContactEntry[]>();

    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }

    return map;
  }, [entries]);

  /* -------- Build heatmap cells ---------- */
  const weeks = useMemo<CareOverviewDayCell[][]>(() => {
    const start = startOfWeekMonday(range.start);
    const end = new Date(range.end);
    end.setHours(0, 0, 0, 0);

    const days: CareOverviewDayCell[] = [];

    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      const key = toDateKey(d);
      const list = entriesByDay.get(key) ?? [];

      let category: CareContactCategory = "none";
      if (list.length >= 2) category = "multiple";
      else if (list.length === 1) category = list[0].category;

      days.push({
        key,
        date: new Date(d),
        category,
        count: list.length,
      });
    }

    const weeks: CareOverviewDayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  }, [range.start, range.end, entriesByDay]);

  /* --------- Month markers ---------- */
  const monthMarkers = useMemo(() => {
    return weeks
      .map((week, index) => {
        const firstDay = week[0]?.date;
        const prevWeek = weeks[index - 1];
        const prevDay = prevWeek?.[0]?.date;

        if (!firstDay || (prevDay && sameMonth(prevDay, firstDay))) return null;

        return {
          weekIndex: index,
          label: MONTH_LABELS[firstDay.getMonth()],
          year: firstDay.getFullYear(),
        };
      })
      .filter(Boolean);
  }, [weeks]);

  /* ----------------------------
   * Selected day
   * -------------------------- */

  const selectedDate = selectedKey ? parseDateKey(selectedKey) : null;
  const selectedEntries = selectedKey ? entriesByDay.get(selectedKey) ?? [] : [];

  /* ====== RENDER ========== */
  return (
    <>
      <section className="rounded border border-gray-300 bg-white text-xs">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
          <div className="flex items-center gap-2">
            <CalendarTodayIcon fontSize="small" />
            <span className="text-[13px] font-semibold">Care overview</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-[11px]">
              My unit
            </button>

            <button className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-blue-700 hover:bg-blue-50">
              <RefreshIcon fontSize="small" />
              Update
            </button>

            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
              <MoreVertIcon fontSize="small" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="px-3 py-3">
          <button
            type="button"
            onClick={() => setYearsBack((y) => y + 1)}
            className="mb-2 inline-flex items-center gap-2 text-[12px] font-medium text-blue-700"
          >
            <KeyboardArrowLeftIcon fontSize="small" />
            Load another year
          </button>

          <div className="flex items-start gap-4">
            {/* Heatmap */}
            <div className="overflow-x-auto">
              {/* Month header */}
              <div className="ml-7 flex gap-1.5 pb-2 text-[10px] text-gray-500">
                {weeks.map((_, i) => {
                  const marker = monthMarkers.find((m) => m?.weekIndex === i);
                  return <div key={i} className="w-3">{marker?.label ?? ""}</div>;
                })}
              </div>

              <div className="flex gap-1.5">
                {/* Weekday labels */}
                <div className="flex w-6 flex-col gap-1.5 pt-[2px] text-[10px] text-gray-400">
                  {WEEKDAY_LABELS.map((w) => (
                    <div key={w} className="h-3">{w}</div>
                  ))}
                </div>

                {/* Weeks */}
                <div className="flex gap-1.5">
                  {weeks.map((week) => (
                    <div key={week[0]?.key} className="flex flex-col gap-1.5">
                      {week.map((cell) => (
                        <button
                          key={cell.key}
                          type="button"
                          onClick={() => setSelectedKey(cell.key)}
                          title={`${cell.key}${cell.count ? ` • ${cell.count} contact(s)` : ""}`}
                          className={[
                            "h-3 w-3 rounded-sm",
                            categoryClass(cell.category),
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="min-w-[180px] text-[12px] text-gray-700">
              <div className="mb-2 font-medium text-gray-600">Explanation:</div>

              {[
                ["multiple", "Multiple contacts"],
                ["inpatient", "Inpatient care"],
                ["outpatient", "Outpatient care"],
                ["secrecy", "Privacy/blocking"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`inline-block h-3 w-3 rounded ${categoryClass(key as CareContactCategory)}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details dialog */}
      <CareContactDetailsDialog
        open={Boolean(selectedKey)}
        dateLabel={selectedDate ? formatDateLabel(selectedDate) : ""}
        entries={selectedEntries}
        onClose={() => setSelectedKey(null)}
      />
    </>
  );
};
