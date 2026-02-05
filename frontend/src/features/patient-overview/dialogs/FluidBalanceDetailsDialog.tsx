// src/features/patient-overview/dialogs/FluidBalanceDetailsDialog.tsx
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TodayIcon from "@mui/icons-material/Today";
import EditIcon from "@mui/icons-material/Edit";

import type { FluidBalanceEntry } from "../types";

export type FluidBalanceDaySlot = { key: string; label: string };

export type FluidBalanceDayRow =
  | { kind: "section"; label: string }
  | {
      kind: "row";
      label: string;
      volumeMl?: number | null;
      kcal?: number | null;
      slots?: Record<string, number | null>;
      muted?: boolean;
    }
  | {
      kind: "total";
      label: string;
      volumeMl?: number | null;
      kcal?: number | null;
      strong?: boolean;
      muted?: boolean;
    };

export type FluidBalanceDayModel = {
  title: string;
  slots: FluidBalanceDaySlot[];
  rows: FluidBalanceDayRow[];
  plannedMedicationFluids: { name: string; volumeMl?: number | null; isStarred?: boolean }[];
};

type Props = {
  open: boolean;
  day: FluidBalanceDayModel;
  entries: FluidBalanceEntry[];
  onClose: () => void;

  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;

  onRegister: () => void;
  onEditEntry: (id: string) => void;
};

export const FluidBalanceDetailsDialog: React.FC<Props> = ({
  open,
  day,
  entries,
  onClose,
  onPrev,
  onNext,
  onToday,
  onRegister,
  onEditEntry,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <div style={{ fontWeight: 700 }}>{day.title}</div>

        <div className="flex items-center gap-2">
          <Tooltip title="Previous day">
            <IconButton onClick={onPrev}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Today">
            <Button onClick={onToday} variant="outlined" startIcon={<TodayIcon />}>
              Today
            </Button>
          </Tooltip>

          <Tooltip title="Next day">
            <IconButton onClick={onNext}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Button variant="contained" onClick={onRegister}>
            Register values
          </Button>
        </div>
      </DialogTitle>

      <DialogContent>
        {/* BIG TABLE */}
        <div className="rounded border border-gray-300 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-300">
                <th className="p-2 text-left">Ordered fluid balance</th>
                <th className="p-2 text-right">Volume (ml)</th>
                <th className="p-2 text-right">Total energy (kcal)</th>
                {day.slots.map((s) => (
                  <th key={s.key} className="p-2 text-right">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {day.rows.map((r, idx) => {
                if (r.kind === "section") {
                  return (
                    <tr key={`sec-${idx}`} className="bg-gray-100 border-b border-gray-300">
                      <td className="p-2 font-semibold" colSpan={3 + day.slots?.length}>
                        {r.label}
                      </td>
                    </tr>
                  );
                }

                const isTotal = r.kind === "total";
                const strong = (r as any).strong;

                return (
                  <tr
                    key={`row-${idx}`}
                    className={`border-b border-gray-200 ${isTotal ? "bg-white" : ""} ${r.muted ? "text-gray-500" : ""}`}
                  >
                    <td className={`p-2 ${strong ? "font-semibold" : ""}`}>{r.label}</td>
                    <td className={`p-2 text-right ${strong ? "font-semibold" : ""}`}>
                      {typeof r.volumeMl === "number" ? r.volumeMl.toLocaleString("sv-SE") : ""}
                    </td>
                    <td className={`p-2 text-right ${strong ? "font-semibold" : ""}`}>
                      {typeof r.kcal === "number" ? r.kcal.toLocaleString("sv-SE") : ""}
                    </td>
                    {day.slots.map((s) => (
                      <td key={s.key} className="p-2 text-right">
                        {"slots" in r && r.slots ? (r.slots[s.key] ?? "") : ""}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PLANNED TABLE */}
        <div className="mt-4 rounded border border-gray-300 overflow-hidden">
          <div className="bg-gray-50 p-2 font-semibold border-b border-gray-300">Planned medication fluids</div>
          <table className="w-full text-sm">
            <thead className="bg-white">
              <tr className="border-b border-gray-200">
                <th className="p-2 text-left">Planned medication fluids</th>
                <th className="p-2 text-right">Volume (ml)</th>
              </tr>
            </thead>
            <tbody>
              {day.plannedMedicationFluids.map((p, i) => (
                <tr key={p.name + i} className="border-b border-gray-100">
                  <td className="p-2">{p.name}{p.isStarred ? " *" : ""}</td>
                  <td className="p-2 text-right">{typeof p.volumeMl === "number" ? p.volumeMl : ""}</td>
                </tr>
              ))}
              <tr className="bg-white">
                <td className="p-2 font-semibold">Planned from medication</td>
                <td className="p-2 text-right font-semibold">
                  {day.plannedMedicationFluids
                    .reduce((sum, x) => sum + (typeof x.volumeMl === "number" ? x.volumeMl : 0), 0)
                    .toLocaleString("sv-SE")}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="p-2 text-xs text-gray-600">
            Orders with certain dosing types (e.g. PRN/conditional) may be marked with an asterisk (*) (mock text).
          </div>
        </div>

        <Divider sx={{ my: 3 }} />

        {/* REGISTERED ENTRIES LIST (for edit) */}
        <div className="rounded border border-gray-300 overflow-hidden">
          <div className="bg-gray-50 p-2 font-semibold border-b border-gray-300">Registered entries</div>

          {entries?.length === 0 ? (
            <div className="p-3 text-sm text-gray-600">No registered entries yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-white">
                <tr className="border-b border-gray-200">
                  <th className="p-2 text-left">Label</th>
                  <th className="p-2 text-left">Measurement time</th>
                  <th className="p-2 text-right">Total in (ml)</th>
                  <th className="p-2 text-right">Total out (ml)</th>
                  <th className="p-2 text-right">Balance</th>
                  <th className="p-2 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-gray-100">
                    <td className="p-2">{e.label}</td>
                    <td className="p-2">{e.details?.measuredAt ?? "-"}</td>
                    <td className="p-2 text-right">{e.intakeMl.toLocaleString("sv-SE")}</td>
                    <td className="p-2 text-right">{e.outputMl.toLocaleString("sv-SE")}</td>
                    <td className="p-2 text-right font-semibold">{e.balance}</td>
                    <td className="p-2 text-right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => onEditEntry(e.id)} size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
