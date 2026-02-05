// src/features/unit-overview/dialogs/EwsDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import type { Inpatient } from "../types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type EwsMeasurementData = {
  date: string;
  time: string;
  dateTime: string;

  respiratoryRate: string;
  spo2: string;

  hasOxygen: "yes" | "no";
  oxygenLiters: string;

  systolicBP: string;
  diastolicBP: string;
  pulse: string;

  consciousness: string;
  temperature: string;

  score: string;
  comment: string;
};

type EwsDialogProps = {
  open: boolean;
  patient: Inpatient | null;
  onClose: () => void;
  onSave: (data: EwsMeasurementData) => void;
};

// -----------------------------------------------------------------------------
// Constants + helpers
// -----------------------------------------------------------------------------

const DEFAULT_FORM: EwsMeasurementData = {
  date: "",
  time: "",
  dateTime: "",
  respiratoryRate: "",
  spo2: "",
  hasOxygen: "no",
  oxygenLiters: "",
  systolicBP: "",
  diastolicBP: "",
  pulse: "",
  consciousness: "alert",
  temperature: "",
  score: "",
  comment: "",
};

const buildDateTime = (date: string, time: string) => {
  if (!date || !time) return "";
  return `${date} ${time}`;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const EwsDialog: React.FC<EwsDialogProps> = ({ open, patient, onClose, onSave }) => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [form, setForm] = useState<EwsMeasurementData>(DEFAULT_FORM);

  // derived (handy for render)
  const showOxygenLiters = useMemo(() => form.hasOxygen === "yes", [form.hasOxygen]);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const hh = `${now.getHours()}`.padStart(2, "0");
    const mm = `${now.getMinutes()}`.padStart(2, "0");
    const time = `${hh}:${mm}`;

    setForm({
      ...DEFAULT_FORM,
      date,
      time,
      dateTime: buildDateTime(date, time),
    });
  }, [open]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const updateField =
    (field: keyof EwsMeasurementData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setForm((prev) => {
        const next = { ...prev, [field]: value };

        // keep dateTime in sync if date or time changes
        if (field === "date" || field === "time") {
          const date = field === "date" ? value : next.date;
          const time = field === "time" ? value : next.time;
          next.dateTime = buildDateTime(date, time);
        }

        // if oxygen switched off, clear liters
        if (field === "hasOxygen" && value === "no") {
          next.oxygenLiters = "";
        }

        return next;
      });
    };

  const setHasOxygen = (v: "yes" | "no") => {
    setForm((prev) => ({
      ...prev,
      hasOxygen: v,
      oxygenLiters: v === "no" ? "" : prev.oxygenLiters,
    }));
  };

  const handleSave = () => {
    const payload: EwsMeasurementData = {
      ...form,
      dateTime: form.dateTime || buildDateTime(form.date, form.time),
      comment: form.comment.trim(),
    };
    onSave(payload);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add EWS / NEWS</DialogTitle>

      <DialogContent>
        {!patient ? null : (
          <div className="mt-2 space-y-3 text-sm">
            {/* Patient header */}
            <div>
              <span className="font-semibold">Patient: </span>
              {patient.name} ({patient.nationalId})
            </div>

            {/* Date / time */}
            <div className="flex gap-2">
              <TextField
                label="Date"
                type="date"
                size="small"
                value={form.date}
                onChange={updateField("date")}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                type="time"
                size="small"
                value={form.time}
                onChange={updateField("time")}
                InputLabelProps={{ shrink: true }}
              />
            </div>

            {/* Respiratory rate */}
            <TextField
              label="Respiratory rate (/min)"
              type="number"
              size="small"
              fullWidth
              value={form.respiratoryRate}
              onChange={updateField("respiratoryRate")}
            />

            {/* SpO2 + oxygen */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <TextField
                  label="Oxygen saturation (%)"
                  type="number"
                  size="small"
                  value={form.spo2}
                  onChange={updateField("spo2")}
                />

                <RadioGroup
                  row
                  value={form.hasOxygen}
                  onChange={(e) => setHasOxygen(e.target.value as "yes" | "no")}
                >
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No O₂" />
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="O₂" />
                </RadioGroup>
              </div>

              {showOxygenLiters && (
                <TextField
                  label="Oxygen (L/min)"
                  type="number"
                  size="small"
                  value={form.oxygenLiters}
                  onChange={updateField("oxygenLiters")}
                />
              )}
            </div>

            {/* Blood pressure + pulse */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <TextField
                label="Systolic blood pressure (mmHg)"
                type="number"
                size="small"
                fullWidth
                value={form.systolicBP}
                onChange={updateField("systolicBP")}
              />
              <TextField
                label="Diastolic blood pressure (mmHg)"
                type="number"
                size="small"
                fullWidth
                value={form.diastolicBP}
                onChange={updateField("diastolicBP")}
              />
              <TextField
                label="Pulse rate (/min)"
                type="number"
                size="small"
                fullWidth
                value={form.pulse}
                onChange={updateField("pulse")}
              />
            </div>

            {/* Consciousness */}
            <TextField
              label="Level of consciousness"
              size="small"
              select
              fullWidth
              value={form.consciousness}
              onChange={updateField("consciousness")}
              helperText="Based on AVPU / NEWS2 scoring"
            >
              <MenuItem value="alert">Alert (0 points)</MenuItem>
              <MenuItem value="confused">New confusion (3 points)</MenuItem>
              <MenuItem value="responseVoice">Responds to voice (3 points)</MenuItem>
              <MenuItem value="responsePain">Responds to pain (3 points)</MenuItem>
              <MenuItem value="unresponsive">Unresponsive (3 points)</MenuItem>
            </TextField>

            {/* Temperature */}
            <TextField
              label="Temperature (°C)"
              type="number"
              size="small"
              fullWidth
              value={form.temperature}
              onChange={updateField("temperature")}
            />

            {/* Total score */}
            <TextField
              label="NEWS / EWS score"
              type="number"
              size="small"
              fullWidth
              value={form.score}
              onChange={updateField("score")}
              helperText="Calculated according to local NEWS2 rules (enter final score here)."
            />

            {/* Comment */}
            <TextField
              label="Comment (optional)"
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={form.comment}
              onChange={updateField("comment")}
            />
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
};

export default EwsDialog;
