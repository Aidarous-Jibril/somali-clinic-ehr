// src/components/medications/dispensing/InfusionEndDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import type { DoseMeta, DoseRef, Medication } from "../../../features/medications/types";

import { toDateTimeLocal } from "./dispensing.utils";

type Props = {
  open: boolean;
  onClose: () => void;

  onSave: (payload: {
    endAt: string; // datetime-local string
    infusedMl: number;
    totalInfusedMl?: number;
    comment?: string;
  }) => void;

  dose: DoseRef | null;
  med: Medication | null;
  meta: DoseMeta;

  SignedByBlock?: React.ReactNode;
};

function clampNumber(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export function InfusionEndDialog({
  open,
  onClose,
  onSave,
  dose,
  med,
  meta,
  SignedByBlock,
}: Props) {
  const defaultEndAt = useMemo(() => {
    return meta?.infusionEndAt ? String(meta.infusionEndAt) : toDateTimeLocal(new Date());
  }, [meta?.infusionEndAt]);

  const [endAt, setEndAt] = useState<string>(defaultEndAt);
  const [infusedMl, setInfusedMl] = useState<string>(
    meta?.infusionInfusedMl != null ? String(meta.infusionInfusedMl) : ""
  );
  const [totalInfusedMl, setTotalInfusedMl] = useState<string>(
    meta?.infusionTotalInfusedMl != null ? String(meta.infusionTotalInfusedMl) : ""
  );
  const [comment, setComment] = useState<string>(meta?.comment ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setEndAt(meta?.infusionEndAt ? String(meta.infusionEndAt) : toDateTimeLocal(new Date()));
    setInfusedMl(meta?.infusionInfusedMl != null ? String(meta.infusionInfusedMl) : "");
    setTotalInfusedMl(
      meta?.infusionTotalInfusedMl != null ? String(meta.infusionTotalInfusedMl) : ""
    );
    setComment(meta?.comment ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const title = med ? `${med.name}${med.strength ? ` • ${med.strength}` : ""}` : "Infusion";

  const ordered = meta?.infusionOrderedMl != null ? `${meta.infusionOrderedMl} ml` : undefined;
  const prepared = meta?.infusionPreparedMl != null ? `${meta.infusionPreparedMl} ml` : undefined;
  const rate = meta?.infusionRateMlHr != null ? `${meta.infusionRateMlHr} ml/h` : undefined;
  const started = meta?.infusionStartAt ? String(meta.infusionStartAt) : undefined;

  const handleSave = () => {
    const vInfused = clampNumber(infusedMl);
    if (!Number.isFinite(vInfused) || vInfused <= 0) {
      setError("Enter infused volume (ml).");
      return;
    }
    const vTotal = totalInfusedMl.trim() ? clampNumber(totalInfusedMl) : undefined;
    if (vTotal != null && (!Number.isFinite(vTotal) || vTotal <= 0)) {
      setError("Total infused (all bags) must be a positive number.");
      return;
    }

    onSave({
      endAt,
      infusedMl: vInfused,
      totalInfusedMl: vTotal,
      comment: comment.trim() ? comment.trim() : undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>End infusion (Avsluta)</DialogTitle>

      <DialogContent dividers>
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="rounded border border-gray-200 bg-white">
            <div className="border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
              Ordered medication
            </div>
            <div className="p-3 text-xs space-y-2">
              <div className="font-semibold text-gray-900">{title}</div>

              {dose ? (
                <div className="rounded border border-gray-200 bg-gray-50 p-2">
                  <div className="text-[11px] text-gray-600">Dose</div>
                  <div className="font-semibold">
                    {dose.item.date} {dose.item.time}
                  </div>
                  <div className="text-gray-700">{dose.item.label ?? ""}</div>
                </div>
              ) : null}

              <div className="text-[11px] text-gray-600 space-y-1">
                {ordered ? (
                  <div>
                    Ordered: <span className="font-medium text-gray-900">{ordered}</span>
                  </div>
                ) : null}
                {prepared ? (
                  <div>
                    Prepared: <span className="font-medium text-gray-900">{prepared}</span>
                  </div>
                ) : null}
                {rate ? (
                  <div>
                    Rate: <span className="font-medium text-gray-900">{rate}</span>
                  </div>
                ) : null}
                {started ? (
                  <div>
                    Started: <span className="font-medium text-gray-900">{started}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <TextField
              label="Time (end)"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              size="small"
              fullWidth
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField
                label="Infused volume (ml) — current bag"
                value={infusedMl}
                onChange={(e) => setInfusedMl(e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Total infused (ml) — all bags (optional)"
                value={totalInfusedMl}
                onChange={(e) => setTotalInfusedMl(e.target.value)}
                size="small"
                fullWidth
              />
            </div>

            <TextField
              label="Comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={3}
            />

            {SignedByBlock ? SignedByBlock : null}

            {error ? (
              <div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          End infusion
        </Button>
      </DialogActions>
    </Dialog>
  );
}
