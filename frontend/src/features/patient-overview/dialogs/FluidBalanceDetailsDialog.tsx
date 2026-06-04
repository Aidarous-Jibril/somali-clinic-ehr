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

type Props = {
  open: boolean;
  day?: {
    title: string;
    entries: FluidBalanceEntry[];
  };
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
  const safeEntries = entries ?? [];
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      {/* HEADER */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <div style={{ fontWeight: 700 }}>
          {day?.title ?? "Fluid balance"}
        </div>

        <div className="flex items-center gap-2">
          <Tooltip title="Previous day">
            <IconButton onClick={onPrev}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Today">
            <Button
              onClick={onToday}
              variant="outlined"
              startIcon={<TodayIcon />}
            >
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
        {/* 🔥 SIMPLE SUMMARY (NEW) */}
        {day && (
          <div className="mb-4 text-sm">
            <div>Total in: {safeEntries?.reduce((s, e) => s + e.intakeMl, 0)} ml</div>
            <div>Total out: {safeEntries?.reduce((s, e) => s + e.outputMl, 0)} ml</div>
          </div>
        )}

        <Divider sx={{ my: 2 }} />

        {/* REGISTERED ENTRIES (REAL DATA) */}
        <div className="rounded border border-gray-300 overflow-hidden">
          <div className="bg-gray-50 p-2 font-semibold border-b border-gray-300">
            Registered entries
          </div>

          {safeEntries?.length === 0 ? (
            <div className="p-3 text-sm text-gray-600">
              No registered entries yet.
            </div>
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
                {safeEntries?.map((e) => (
                  <tr key={e.id} className="border-b border-gray-100">
                    <td className="p-2">{e.label}</td>
                    <td className="p-2">
                      {e?.measuredAt
                        ? new Date(e.measuredAt).toLocaleString("sv-SE")
                        : "-"}
                    </td>
                    <td className="p-2 text-right">
                      {e.intakeMl.toLocaleString("sv-SE")}
                    </td>
                    <td className="p-2 text-right">
                      {e.outputMl.toLocaleString("sv-SE")}
                    </td>
                    <td className="p-2 text-right font-semibold">
                      {e.balance}
                    </td>
                    <td className="p-2 text-right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => onEditEntry(e.id)}
                          size="small"
                        >
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