// src/features/patient-overview/dialogs/AddFluidDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
} from "@mui/material";

import type { FluidBalanceDetails, FluidBalanceEntry } from "../types";

type Props = {
  open: boolean;
  label: string; // e.g. "Today"
  period: string; // e.g. "05:00–04:59"
  editing?: FluidBalanceEntry | null;
  onClose: () => void;
  onSave: (entry: FluidBalanceEntry) => void;
};

type FormState = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  oralMl: string;
  oralKcal: string;
  enteralMl: string;
  enteralKcal: string;
  bleedingMl: string;
  faecesMl: string;
  vomitingMl: string;
  urineMl: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const nowHHmm = () => {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const splitMeasuredAt = (measuredAt: string) => {
  // expects "YYYY-MM-DD HH:mm"
  const [date, time] = measuredAt.split(" ");
  return { date: date ?? todayISO(), time: (time ?? nowHHmm()).slice(0, 5) };
};

const toNumberOrZero = (s: string) => {
  const v = Number(String(s).replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

const formatBalanceMl = (ml: number) => {
  const sign = ml >= 0 ? "+" : "−";
  return `${sign}${Math.abs(ml).toLocaleString("sv-SE")} ml`;
};

export const AddFluidDialog: React.FC<Props> = ({
  open,
  label,
  period,
  editing,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<FormState>({
    date: todayISO(),
    time: nowHHmm(),
    oralMl: "",
    oralKcal: "",
    enteralMl: "",
    enteralKcal: "",
    bleedingMl: "",
    faecesMl: "",
    vomitingMl: "",
    urineMl: "",
  });

  // Prefill for edit / reset for create
  useEffect(() => {
    if (!open) return;

    if (editing?.details) {
      const d = editing.details;
      const { date, time } = splitMeasuredAt(d.measuredAt);

      setForm({
        date,
        time,
        oralMl: d.oralMl ? String(d.oralMl) : "",
        oralKcal: d.oralKcal ? String(d.oralKcal) : "",
        enteralMl: d.enteralMl ? String(d.enteralMl) : "",
        enteralKcal: d.enteralKcal ? String(d.enteralKcal) : "",
        bleedingMl: d.bleedingMl ? String(d.bleedingMl) : "",
        faecesMl: d.faecesMl ? String(d.faecesMl) : "",
        vomitingMl: d.vomitingMl ? String(d.vomitingMl) : "",
        urineMl: d.urineMl ? String(d.urineMl) : "",
      });
    } else {
      setForm({
        date: todayISO(),
        time: nowHHmm(),
        oralMl: "",
        oralKcal: "",
        enteralMl: "",
        enteralKcal: "",
        bleedingMl: "",
        faecesMl: "",
        vomitingMl: "",
        urineMl: "",
      });
    }
  }, [open, editing]);

  const details: FluidBalanceDetails = useMemo(() => {
    const measuredAt = `${form.date} ${form.time}`;
    return {
      measuredAt,
      oralMl: toNumberOrZero(form.oralMl),
      oralKcal: toNumberOrZero(form.oralKcal),
      enteralMl: toNumberOrZero(form.enteralMl),
      enteralKcal: toNumberOrZero(form.enteralKcal),
      bleedingMl: toNumberOrZero(form.bleedingMl),
      faecesMl: toNumberOrZero(form.faecesMl),
      vomitingMl: toNumberOrZero(form.vomitingMl),
      urineMl: toNumberOrZero(form.urineMl),
    };
  }, [form]);

  const totalIn = details.oralMl + details.enteralMl;
  const totalOut = details.bleedingMl + details.faecesMl + details.vomitingMl + details.urineMl;
  const total = totalIn - totalOut;

  const hasAnyValue =
    totalIn !== 0 ||
    totalOut !== 0 ||
    details.oralKcal !== 0 ||
    details.enteralKcal !== 0;

  const saveDisabled = !hasAnyValue;

  const handleSave = () => {
    const id = editing?.id ?? `fluid-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const entry: FluidBalanceEntry = {
      id,
      label: editing?.label ?? label,
      period: editing?.period ?? period,
      intakeMl: totalIn,
      outputMl: totalOut,
      balance: formatBalanceMl(total),
      details,
    };

    onSave(entry);
  };

  const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontSize: 26, fontWeight: 600 }}>
        {editing ? "Edit values" : "Register values"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Measurement time */}
          <div>
            <div className="text-sm font-semibold mb-2">Measurement time:</div>
            <div className="flex flex-wrap gap-2">
              <TextField
                type="date"
                value={form.date}
                onChange={setField("date")}
                size="small"
                sx={{ width: 220 }}
              />
              <TextField
                type="time"
                value={form.time}
                onChange={setField("time")}
                size="small"
                sx={{ width: 180 }}
              />
            </div>
          </div>

          <Divider />

          {/* Parameters */}
          <div className="text-sm font-semibold">Parameters:</div>

          <div className="grid grid-cols-[1fr_40px_240px_240px] gap-3 items-center">
            <div className="text-xs text-gray-500" />
            <div />
            <div className="text-xs text-gray-500 font-semibold">ml</div>
            <div className="text-xs text-gray-500 font-semibold">kcal</div>

            {/* IN section */}
            <div className="font-semibold mt-2">Fluids in</div>
            <div />
            <div />
            <div />

            <div className="py-2">Oral (Intake)</div>
            <div className="text-lg font-semibold text-gray-600">+</div>
            <TextField
              type="number"
              value={form.oralMl}
              onChange={setField("oralMl")}
              size="small"
              placeholder=""
              inputProps={{ min: 0 }}
            />
            <TextField
              type="number"
              value={form.oralKcal}
              onChange={setField("oralKcal")}
              size="small"
              placeholder=""
              inputProps={{ min: 0 }}
            />

            <div className="py-2">Enteral nutrition (Intake)</div>
            <div className="text-lg font-semibold text-gray-600">+</div>
            <TextField
              type="number"
              value={form.enteralMl}
              onChange={setField("enteralMl")}
              size="small"
              placeholder=""
              inputProps={{ min: 0 }}
            />
            <TextField
              type="number"
              value={form.enteralKcal}
              onChange={setField("enteralKcal")}
              size="small"
              placeholder=""
              inputProps={{ min: 0 }}
            />

            {/* OUT section */}
            <div className="font-semibold mt-2">Fluids out</div>
            <div />
            <div />
            <div />

            <div className="py-2">Bleeding (Loss)</div>
            <div className="text-lg font-semibold text-gray-600">−</div>
            <TextField
              type="number"
              value={form.bleedingMl}
              onChange={setField("bleedingMl")}
              size="small"
              placeholder=""
              inputProps={{ min: 0 }}
            />
            <div />

            <div className="py-2">Faeces (Loss)</div>
            <div className="text-lg font-semibold text-gray-600">−</div>
            <TextField
              type="number"
              value={form.faecesMl}
              onChange={setField("faecesMl")}
              size="small"
              placeholder=""
              inputProps={{ min: 0 }}
            />
            <div />

            <div className="py-2">Vomiting (Loss)</div>
            <div className="text-lg font-semibold text-gray-600">−</div>
            <TextField
              type="number"
              value={form.vomitingMl}
              onChange={setField("vomitingMl")}
              size="small"
              placeholder=""
              inputProps={{ min: 0 }}
            />
            <div />

            <div className="py-2">Urine (Loss)</div>
            <div className="text-lg font-semibold text-gray-600">−</div>
            <TextField
              type="number"
              value={form.urineMl}
              onChange={setField("urineMl")}
              size="small"
              placeholder=""
              inputProps={{ min: 0 }}
            />
            <div />
          </div>

          <Divider />

          {/* Totals */}
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">Total in</div>
            <div className="text-right">{totalIn.toLocaleString("sv-SE")} ml</div>

            <div className="font-semibold">Total out</div>
            <div className="text-right">{totalOut.toLocaleString("sv-SE")} ml</div>

            <div className="font-semibold">Total</div>
            <div className="text-right font-semibold">{formatBalanceMl(total)}</div>

            <div className="text-gray-500">Period</div>
            <div className="text-right text-gray-500">{period}</div>

            <div className="text-gray-500">Measurement time</div>
            <div className="text-right text-gray-500">{details.measuredAt}</div>
          </div>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button variant="contained" onClick={handleSave} disabled={saveDisabled}>
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
};
