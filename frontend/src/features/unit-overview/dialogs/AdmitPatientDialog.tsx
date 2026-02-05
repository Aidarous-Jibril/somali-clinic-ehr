// src/features/unit-overview/dialogs/AdmitPatientDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import type { AdmitPatientData, BedSelectOption } from "../types";

type Props = {
  open: boolean;
  defaultWard: string;
  defaultTeam: string;
  beds: BedSelectOption[];
  onClose: () => void;
  onSave: (data: AdmitPatientData) => void;
};

const EMPTY_FORM: AdmitPatientData = {
  nationalId: "",
  name: "",
  bed: "",
  ward: "",
  team: "",
  startDate: "",
  startTime: "",
  ews: "",
};

const WARD_OPTIONS = ["Stroke ward", "Medicine ward 1", "Medicine ward 2"] as const;
const TEAM_OPTIONS = ["Blue team", "Green team", "Red team"] as const;

const AdmitPatientDialog: React.FC<Props> = ({
  open,
  defaultWard,
  defaultTeam,
  beds,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<AdmitPatientData>({
    ...EMPTY_FORM,
    ward: defaultWard,
    team: defaultTeam,
  });

  const bedOptions = useMemo(() => beds ?? [], [beds]);

  useEffect(() => {
    if (!open) return;

    const now = new Date();
    const d = now.toISOString().slice(0, 10);
    const hh = `${now.getHours()}`.padStart(2, "0");
    const mm = `${now.getMinutes()}`.padStart(2, "0");

    setForm({
      ...EMPTY_FORM,
      ward: defaultWard,
      team: defaultTeam,
      startDate: d,
      startTime: `${hh}:${mm}`,
    });
  }, [open, defaultWard, defaultTeam]);

  const updateField =
    (field: keyof AdmitPatientData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Admit patient</DialogTitle>

      <DialogContent>
        <div className="mt-2 space-y-3 text-sm">
          <TextField
            label="National ID"
            size="small"
            fullWidth
            value={form.nationalId}
            onChange={updateField("nationalId")}
          />

          <TextField
            label="Name"
            size="small"
            fullWidth
            value={form.name}
            onChange={updateField("name")}
          />

          <TextField
            label="Bed / Room"
            size="small"
            select
            fullWidth
            value={form.bed}
            onChange={updateField("bed")}
          >
            <MenuItem value="">(Select)</MenuItem>
            {bedOptions.map((b) => (
              <MenuItem key={b.id} value={b.id} disabled={b.disabled}>
                {b.label}
                {b.disabled ? " (occupied)" : ""}
              </MenuItem>
            ))}
          </TextField>

          <div className="flex gap-2">
            <TextField
              label="Ward"
              size="small"
              select
              fullWidth
              value={form.ward}
              onChange={updateField("ward")}
            >
              {WARD_OPTIONS.map((w) => (
                <MenuItem key={w} value={w}>
                  {w}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Team"
              size="small"
              select
              fullWidth
              value={form.team}
              onChange={updateField("team")}
            >
              {TEAM_OPTIONS.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="flex gap-2">
            <TextField
              label="Admission date"
              type="date"
              size="small"
              value={form.startDate}
              onChange={updateField("startDate")}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              size="small"
              value={form.startTime}
              onChange={updateField("startTime")}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <TextField
            label="EWS (optional)"
            size="small"
            type="number"
            value={form.ews}
            onChange={updateField("ews")}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(form)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdmitPatientDialog;
