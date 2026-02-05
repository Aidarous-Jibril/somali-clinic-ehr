// src/features/unit-overview/dialogs/PlannedDischargeDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import type { Inpatient, PlannedDischargeStatus } from "../types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type PlannedDischargeData = {
  date: string;
  time: string;
  status: PlannedDischargeStatus;
};

type PlannedDischargeDialogProps = {
  open: boolean;
  patient: Inpatient | null;
  initialData?: PlannedDischargeData;
  onClose: () => void;
  onSave: (data: PlannedDischargeData) => void;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const getNowDateTime = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const hh = `${now.getHours()}`.padStart(2, "0");
  const mm = `${now.getMinutes()}`.padStart(2, "0");
  return { date, time: `${hh}:${mm}` };
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const PlannedDischargeDialog: React.FC<PlannedDischargeDialogProps> = ({
  open,
  patient,
  initialData,
  onClose,
  onSave,
}) => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [status, setStatus] = useState<PlannedDischargeStatus>("notEvaluated");

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setDate(initialData.date);
      setTime(initialData.time);
      setStatus(initialData.status);
      return;
    }

    const now = getNowDateTime();
    setDate(now.date);
    setTime(now.time);
    setStatus("notEvaluated");
  }, [open, initialData]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleToday = () => {
    const now = getNowDateTime();
    setDate(now.date);
    setTime(now.time);
  };

  const handleSave = () => {
    if (!date || !time) return;
    onSave({ date, time, status });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Planned discharge</DialogTitle>

      <DialogContent>
        {!patient ? null : (
          <div className="mt-2 space-y-3 text-sm">
            {/* Patient header */}
            <div>
              <span className="font-semibold">Patient: </span>
              {patient.name}
            </div>

            {/* Date + time */}
            <div className="flex gap-2">
              <TextField
                label="Planned date"
                type="date"
                size="small"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                type="time"
                size="small"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleToday}
                sx={{ alignSelf: "flex-end" }}
              >
                Today
              </Button>
            </div>

            {/* Status */}
            <div>
              <div className="mb-1 text-xs font-semibold text-gray-700">
                Status of planned discharge
              </div>
              <RadioGroup
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as PlannedDischargeStatus)
                }
              >
                <FormControlLabel
                  value="notEvaluated"
                  control={<Radio size="small" />}
                  label="Not evaluated"
                />
                <FormControlLabel
                  value="possible"
                  control={<Radio size="small" />}
                  label="Possible discharge"
                />
                <FormControlLabel
                  value="safe"
                  control={<Radio size="small" />}
                  label="Safe discharge"
                />
              </RadioGroup>
            </div>
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

export default PlannedDischargeDialog;
