// src/components/medications/dispensing/InfusionDialog.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import type { DoseMeta, DoseRef, Medication } from "../../../features/medications/types";

type InfusionMode = "prepare" | "start" | "stop";

export type InfusionSavePatch = Partial<DoseMeta>;

function toNum(v: string): number | undefined {
  const n = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function guessOrderedFromLabel(label?: string): number | undefined {
  if (!label) return undefined;
  // grabs first number in label, e.g. "1000 ml", "500ml (1000ml)", "500"
  const m = label.match(/(\d+(\.\d+)?)/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function InfusionDialog(props: {
  open: boolean;
  mode: InfusionMode;
  onClose: () => void;
  onSave: (patch: InfusionSavePatch) => void;

  dose: DoseRef | null;
  med: Medication | null;

  // used for default start time
  defaultDateTimeLocal: string;

  // current meta for defaults
  meta: DoseMeta;
}) {
  const { open, mode, onClose, onSave, dose, med, defaultDateTimeLocal, meta } = props;

  const defaultOrdered = useMemo(() => {
    return (
      meta.infusionOrderedMl ??
      meta.infusionPreparedMl ??
      guessOrderedFromLabel(dose?.item?.label) ??
      1000
    );
  }, [meta.infusionOrderedMl, meta.infusionPreparedMl, dose?.item?.label]);

  const [orderedMl, setOrderedMl] = useState(String(defaultOrdered));
  const [preparedMl, setPreparedMl] = useState(String(meta.infusionPreparedMl ?? defaultOrdered));
  const [rateMlHr, setRateMlHr] = useState(String(meta.infusionRateMlHr ?? 80));
  const [startAt, setStartAt] = useState(meta.infusionStartAt ?? defaultDateTimeLocal);
  const [comment, setComment] = useState(meta.comment ?? "");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setOrderedMl(String(defaultOrdered));
    setPreparedMl(String(meta.infusionPreparedMl ?? defaultOrdered));
    setRateMlHr(String(meta.infusionRateMlHr ?? 80));
    setStartAt(meta.infusionStartAt ?? defaultDateTimeLocal);
    setComment(meta.comment ?? "");
  }, [open, defaultOrdered, meta.infusionPreparedMl, meta.infusionRateMlHr, meta.infusionStartAt, meta.comment, defaultDateTimeLocal]);

  function handleSave() {
    setErr(null);

    if (!dose) {
      setErr("No dose selected.");
      return;
    }

    if (mode === "stop") {
      onSave({
        infusionRunning: false,
        // keep other fields for audit
      });
      return;
    }

    const o = toNum(orderedMl);
    const p = toNum(preparedMl);
    const r = toNum(rateMlHr);

    if (mode === "prepare") {
      if (!o || !p) {
        setErr("Enter ordered & prepared volume (ml).");
        return;
      }
      onSave({
        prepared: true,
        infusionOrderedMl: o,
        infusionPreparedMl: p,
        infusionRunning: false,
        comment: comment.trim() ? comment.trim() : undefined,
      });
      return;
    }

    // mode === "start"
    if (!r) {
      setErr("Enter infusion rate (ml/h).");
      return;
    }
    const prepared = toNum(preparedMl) ?? meta.infusionPreparedMl ?? toNum(orderedMl) ?? meta.infusionOrderedMl;
    const ordered = toNum(orderedMl) ?? meta.infusionOrderedMl;

    onSave({
      prepared: true, // if you start, you're implicitly prepared
      infusionOrderedMl: ordered,
      infusionPreparedMl: prepared,
      infusionRateMlHr: r,
      infusionStartAt: startAt,
      infusionRunning: true,
      comment: comment.trim() ? comment.trim() : undefined,
    });
  }

  const title =
    mode === "prepare"
      ? "Prepare infusion (Iordningsställ)"
      : mode === "start"
      ? "Start infusion"
      : "Stop infusion";

  const medName = med ? `${med.name}${med.strength ? ` • ${med.strength}` : ""}` : "—";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <div className="text-sm text-gray-800 font-semibold">{medName}</div>
        <div className="text-xs text-gray-600 mt-1">
          {dose ? `${dose.item.date} ${dose.item.time} — ${dose.item.label}` : "No dose"}
        </div>

        {mode !== "stop" ? (
          <div className="mt-4 grid gap-3">
            <TextField
              label="Ordered volume (ml)"
              size="small"
              value={orderedMl}
              onChange={(e) => setOrderedMl(e.target.value)}
            />

            <TextField
              label="Prepared volume (ml)"
              size="small"
              value={preparedMl}
              onChange={(e) => setPreparedMl(e.target.value)}
              helperText="If you prepare a partial bag/bottle, enter the prepared amount."
            />

            {mode === "start" ? (
              <>
                <TextField
                  label="Start time"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                />

                <TextField
                  label="Rate (ml/h)"
                  size="small"
                  value={rateMlHr}
                  onChange={(e) => setRateMlHr(e.target.value)}
                />
              </>
            ) : null}

            <TextField
              label="Note (optional)"
              size="small"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              minRows={2}
            />

            {err ? <div className="text-sm text-red-700">{err}</div> : null}
          </div>
        ) : (
          <div className="mt-4 text-sm text-gray-700">
            This will stop the running infusion bar (keeps prepared/rate fields for audit).
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
