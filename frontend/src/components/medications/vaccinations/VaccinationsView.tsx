// src/components/medications/vaccinations/VaccinationsView.tsx
import  { useMemo, useState } from "react";
import { Tooltip } from "@mui/material";
import type { PresentationMode, VaccinationEvent, VaccinationRange } from "../../../features/medications/types";
import { VaccinationCardDialog } from "./VaccinationCardDialog";
import { addDays, addMinutes, addMonths, formatDay, formatMonth, formatYear, parseDateSafe } from "./vaccination.utils";
import { vaccinationsMock } from "../../../features/medications/mockData";




export function VaccinationsView({
  presentation,
  sort,
}: {
  presentation: PresentationMode;
  sort: string;
}) {
  const [range, setRange] = useState<VaccinationRange>("10y");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cardOpen, setCardOpen] = useState(false);

  // choose an anchor so screenshots feel similar
  const anchorNow = useMemo(() => new Date("2025-05-08T12:00:00"), []);

  const { start, end, width, ticks } = useMemo(() => {
    let s = new Date(anchorNow);
    let e = new Date(anchorNow);
    let w = 2200; // default wide and scrollable

    if (range === "10y") {
      s = new Date(anchorNow);
      s.setFullYear(s.getFullYear() - 5);
      e = new Date(anchorNow);
      e.setFullYear(e.getFullYear() + 5);
      w = 2400;
    } else if (range === "1y") {
      s = new Date(anchorNow);
      s.setMonth(s.getMonth() - 6);
      e = new Date(anchorNow);
      e.setMonth(e.getMonth() + 6);
      w = 2000;
    } else if (range === "1m") {
      s = addMonths(anchorNow, -1);
      e = addMonths(anchorNow, 1);
      w = 1600;
    } else if (range === "1w") {
      s = addDays(anchorNow, -7);
      e = addDays(anchorNow, 7);
      w = 1400;
    } else if (range === "1d") {
      s = addDays(anchorNow, -1);
      e = addDays(anchorNow, 1);
      w = 1100;
    } else if (range === "1h") {
      s = addMinutes(anchorNow, -60);
      e = addMinutes(anchorNow, 60);
      w = 900;
    } else if (range === "15m") {
      s = addMinutes(anchorNow, -15);
      e = addMinutes(anchorNow, 15);
      w = 700;
    }

    // build tick marks
    const out: { x: number; topLabel?: string; bottomLabel: string }[] = [];
    const span = e.getTime() - s.getTime();

    const pushTick = (d: Date, bottomLabel: string, topLabel?: string) => {
      const x = ((d.getTime() - s.getTime()) / span) * w;
      out.push({ x, bottomLabel, topLabel });
    };

    if (range === "10y") {
      // yearly ticks
      for (let y = s.getFullYear(); y <= e.getFullYear(); y++) {
        const d = new Date(y, 0, 1);
        pushTick(d, String(y));
      }
    } else if (range === "1y") {
      // monthly ticks
      let d = new Date(s.getFullYear(), s.getMonth(), 1);
      while (d <= e) {
        pushTick(d, formatMonth(d), d.getMonth() === 0 ? formatYear(d) : undefined);
        d = addMonths(d, 1);
      }
    } else if (range === "1m") {
      // weekly ticks
      let d = new Date(s);
      while (d <= e) {
        pushTick(d, formatDay(d));
        d = addDays(d, 7);
      }
    } else if (range === "1w") {
      // daily ticks
      let d = new Date(s);
      while (d <= e) {
        pushTick(d, formatDay(d));
        d = addDays(d, 1);
      }
    } else if (range === "1d") {
      // 4-hour ticks
      let d = new Date(s);
      while (d <= e) {
        pushTick(d, d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
        d = addMinutes(d, 240);
      }
    } else if (range === "1h") {
      // 15-min ticks
      let d = new Date(s);
      while (d <= e) {
        pushTick(d, d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
        d = addMinutes(d, 15);
      }
    } else {
      // 5-min ticks
      let d = new Date(s);
      while (d <= e) {
        pushTick(d, d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
        d = addMinutes(d, 5);
      }
    }

    return { start: s, end: e, width: w, ticks: out };
  }, [range, anchorNow]);

  const vax = useMemo(() => {
    const clone = [...vaccinationsMock];

    clone.sort((a, b) => {
      if (sort === "atcAsc") return a.atcCode.localeCompare(b.atcCode);
      if (sort === "atcDesc") return b.atcCode.localeCompare(a.atcCode);
      if (sort === "nameAsc") return a.name.localeCompare(b.name);
      if (sort === "nameDesc") return b.name.localeCompare(a.name);
      return 0;
    });

    return clone;
  }, [sort]);

  const inWindow = (ev: VaccinationEvent) => {
    const d = parseDateSafe(ev.at);
    if (!d) return false;
    return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
  };

  const xFor = (iso: string) => {
    const d = parseDateSafe(iso);
    if (!d) return 0;
    const span = end.getTime() - start.getTime();
    return ((d.getTime() - start.getTime()) / span) * width;
  };

  const rangeButtons: Array<{ key: VaccinationRange; label: string }> = [
    { key: "10y", label: "10y" },
    { key: "1y", label: "1y" },
    { key: "1m", label: "1m" },
    { key: "1w", label: "1w" },
    { key: "1d", label: "1d" },
    { key: "1h", label: "1h" },
    { key: "15m", label: "15m" },
  ];

  return (
    <div className="h-full grid grid-cols-[minmax(380px,0.9fr)_minmax(0,1.6fr)]">
      {/* LEFT LIST */}
      <div className="h-full overflow-auto border-r border-gray-200">
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="text-gray-600">
              <th className="w-7 border-b border-gray-200 px-2 py-1 text-left font-normal"></th>
              <th className="border-b border-gray-200 px-2 py-1 text-left font-normal">Vaccine</th>
              <th className="border-b border-gray-200 px-2 py-1 text-left font-normal">Dosing</th>
              <th className="w-16 border-b border-gray-200 px-2 py-1 text-left font-normal">ATC</th>
              <th className="w-28 border-b border-gray-200 px-2 py-1 text-left font-normal">Start</th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-gray-100">
              <td colSpan={5} className="border-b border-gray-200 px-2 py-1 font-semibold text-gray-800">
                Current vaccine treatments [{vax.length}]
              </td>
            </tr>

            {vax.map((vx) => {
              const isSel = vx.id === selectedId;

              return (
                <tr
                  key={vx.id}
                  className={
                    "cursor-pointer border-b border-gray-100 hover:bg-blue-50 " +
                    (isSel ? "bg-blue-50" : "bg-white")
                  }
                  onClick={() => setSelectedId(vx.id)}
                >
                  <td className="px-2 py-1">
                    <input type="checkbox" />
                  </td>

                  <td className="px-2 py-1">
                    <Tooltip title={vx.tooltip ?? vx.reason} arrow placement="top">
                      <div>
                        <div className="font-medium text-gray-900">{vx.name}</div>
                        {presentation === "large" && (
                          <div className="text-[10px] text-gray-500">
                            {vx.form} • {vx.route}
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  </td>

                  <td className="px-2 py-1 text-gray-700">
                    {vx.events.length ? `${vx.events.length} dose${vx.events.length > 1 ? "s" : ""}` : "—"}
                    <div className="mt-1 text-[10px] text-gray-500">{vx.reason}</div>
                  </td>

                  <td className="px-2 py-1 text-gray-600">{vx.atcCode}</td>
                  <td className="px-2 py-1 text-gray-600">{vx.startDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* RIGHT TIMELINE */}
      <div className="h-full flex flex-col bg-white">
        {/* header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-3 py-2 text-[11px] text-gray-600">
            <div className="font-semibold text-gray-800">Vaccinations timeline</div>

            <div className="flex items-center gap-2">
              {rangeButtons.map((b) => {
                const active = b.key === range;
                return (
                  <button
                    key={b.key}
                    onClick={() => setRange(b.key)}
                    className={"rounded px-2 py-1 text-[11px] " + (active ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900")}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* axis */}
          <div className="overflow-x-auto">
            <div className="relative border-t border-gray-100" style={{ height: 54, width }}>
              {ticks.map((t, i) => (
                <div key={t.x + ":" + i} className="absolute top-0" style={{ left: t.x }}>
                  <div className="h-[54px] w-px bg-gray-200" />
                  {t.topLabel && <div className="absolute top-2 -translate-x-1/2 text-[10px] text-gray-500">{t.topLabel}</div>}
                  <div className="absolute bottom-2 -translate-x-1/2 text-[10px] text-gray-500">{t.bottomLabel}</div>
                </div>
              ))}

              {/* orange "now" marker */}
              <div className="absolute top-0" style={{ left: xFor(anchorNow.toISOString()) }}>
                <div className="absolute -top-1 -translate-x-1/2 h-0 w-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-orange-500" />
                <div className="h-[54px] w-px bg-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* rows */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div style={{ minWidth: width }}>
            {vax.map((vx) => {
              const isSel = vx.id === selectedId;
              const visible = vx.events.filter(inWindow);

              return (
                <div
                  key={vx.id}
                  className={"relative border-b border-gray-100 " + (isSel ? "bg-blue-50" : "bg-white")}
                  style={{ height: 56 }}
                >
                  {/* faint grid continuation */}
                  {ticks.map((t, i) => (
                    <div key={vx.id + ":" + i} className="absolute top-0 h-full w-px bg-gray-100" style={{ left: t.x }} />
                  ))}

                  {visible.map((ev, idx) => {
                    const x = xFor(ev.at);
                    const d = parseDateSafe(ev.at)!;

                    const icon = ev.status === "given" ? "✅" : "🕒";
                    const tip = `${vx.name} — ${formatDay(d)} ${d.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} — ${ev.status}`;

                    return (
                      <Tooltip key={vx.id + ":" + ev.at + ":" + idx} title={tip} arrow placement="top">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer select-none"
                          style={{ left: x }}
                        >
                          <div className="text-[10px] text-gray-600">
                            {d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-gray-800">
                            <span>{icon}</span>
                            <span className="font-semibold">{ev.doseLabel}</span>
                          </div>
                        </div>
                      </Tooltip>
                    );
                  })}

                  {/* “Treatment ended” hint (Cosmic-like) */}
                  {range === "10y" || range === "1y" ? (
                    <div className="absolute top-2 right-6 text-[10px] text-gray-400">Treatment ended.</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* bottom right buttons like Cosmic */}
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 flex items-center justify-end gap-2">
          <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs">Order history ▾</button>
          <button
            className="rounded border border-gray-300 bg-white px-3 py-1 text-xs"
            onClick={() => setCardOpen(true)}
          >
            Vaccination card
          </button>
          <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs">Self-medication</button>
        </div>

        <VaccinationCardDialog open={cardOpen} onClose={() => setCardOpen(false)} vaccinations={vax} />
      </div>
    </div>
  );
}
