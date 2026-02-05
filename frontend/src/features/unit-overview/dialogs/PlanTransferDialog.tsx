// src/features/unit-overview/dialogs/PlanTransferDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { Inpatient } from "../types";

import {
  Button,
  Checkbox,
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

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type PlanTransferType = "Same episode" | "New episode" | "Other hospital";

export type PlanTransferData = {
  type: PlanTransferType;

  fromUnit: string;
  toUnit: string;

  plannedDate: string;
  plannedTime: string;

  // optional MVP fields (not persisted in Transfer type yet)
  technicalUnit?: string;
  specialBedNeeds?: string;

  decided: boolean;
  patientReady: boolean;
};

type Props = {
  open: boolean;
  patient: Inpatient | null;

  // Use readonly to avoid "readonly tuple not assignable to string[]" issues.
  availableUnits: readonly string[];

  onClose: () => void;
  onSave: (data: PlanTransferData) => void;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function nowDateTimeParts() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const hh = `${now.getHours()}`.padStart(2, "0");
  const mm = `${now.getMinutes()}`.padStart(2, "0");
  return { date, time: `${hh}:${mm}` };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const PlanTransferDialog: React.FC<Props> = ({
  open,
  patient,
  availableUnits,
  onClose,
  onSave,
}) => {
  const defaultFromUnit = useMemo(() => patient?.ward ?? "", [patient?.ward]);

  const [form, setForm] = useState<PlanTransferData>({
    type: "Same episode",
    fromUnit: defaultFromUnit,
    toUnit: "",
    plannedDate: "",
    plannedTime: "",
    technicalUnit: "",
    specialBedNeeds: "",
    decided: true,
    patientReady: true,
  });

  // Initialize/re-initialize when dialog opens or patient changes
  useEffect(() => {
    if (!open) return;

    const { date, time } = nowDateTimeParts();

    setForm({
      type: "Same episode",
      fromUnit: patient?.ward ?? "",
      toUnit: "",
      plannedDate: date,
      plannedTime: time,
      technicalUnit: "",
      specialBedNeeds: "",
      decided: true,
      patientReady: true,
    });
  }, [open, patient?.nationalId, patient?.ward]);

  // Generic setter to keep handlers tidy
  const setField = <K extends keyof PlanTransferData>(
    key: K,
    value: PlanTransferData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => onSave(form);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Plan transfer</DialogTitle>

      <DialogContent>
        {!patient ? null : (
          <div className="mt-2 space-y-3 text-sm">
            {/* Patient header */}
            <div>
              <span className="font-semibold">Patient: </span>
              {patient.name} ({patient.nationalId})
            </div>

            {/* Transfer type */}
            <div>
              <div className="mb-1 text-xs font-semibold text-gray-700">
                Type of transfer
              </div>
              <RadioGroup
                row
                value={form.type}
                onChange={(e) =>
                  setField("type", e.target.value as PlanTransferType)
                }
              >
                <FormControlLabel
                  value="Same episode"
                  control={<Radio size="small" />}
                  label="Same episode"
                />
                <FormControlLabel
                  value="New episode"
                  control={<Radio size="small" />}
                  label="New episode"
                />
                <FormControlLabel
                  value="Other hospital"
                  control={<Radio size="small" />}
                  label="Other hospital"
                />
              </RadioGroup>
            </div>

            {/* Units */}
            <div className="flex gap-2">
              <TextField
                label="Transfer from unit"
                size="small"
                fullWidth
                value={form.fromUnit}
                onChange={(e) => setField("fromUnit", e.target.value)}
              />

              <TextField
                label="Transfer to unit"
                size="small"
                fullWidth
                select
                value={form.toUnit}
                onChange={(e) => setField("toUnit", e.target.value)}
              >
                <MenuItem value="">(Select)</MenuItem>
                {availableUnits.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Planned date/time */}
            <div className="flex gap-2">
              <TextField
                label="Planned date"
                type="date"
                size="small"
                value={form.plannedDate}
                onChange={(e) => setField("plannedDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                type="time"
                size="small"
                value={form.plannedTime}
                onChange={(e) => setField("plannedTime", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>

            {/* Optional fields */}
            <TextField
              label="Technical unit (optional)"
              size="small"
              fullWidth
              value={form.technicalUnit || ""}
              onChange={(e) => setField("technicalUnit", e.target.value)}
            />

            <TextField
              label="Special bed needs (optional)"
              size="small"
              fullWidth
              placeholder="e.g. isolation, oxygen, telemetry..."
              value={form.specialBedNeeds || ""}
              onChange={(e) => setField("specialBedNeeds", e.target.value)}
            />

            {/* Flags */}
            <div className="flex flex-col">
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={form.decided}
                    onChange={(e) => setField("decided", e.target.checked)}
                  />
                }
                label="Transfer decided"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={form.patientReady}
                    onChange={(e) => setField("patientReady", e.target.checked)}
                  />
                }
                label="Patient ready to transfer"
              />
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

export default PlanTransferDialog;
