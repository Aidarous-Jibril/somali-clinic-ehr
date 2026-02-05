// src/features/unit-overview/dialogs/TransferPatientDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
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
import type { Transfer, TransferPatientData } from "../types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------


type TransferPatientDialogProps = {
  open: boolean;

  // Can be a real Transfer (inbound) OR a “virtual transfer” built from selected inpatient (outbound)
  transfer: Transfer | null;

  facilityOptions: string[];
  unitsByFacility: Record<string, string[]>;

  onClose: () => void;
  onTransfer: (data: TransferPatientData) => void;

  // Optional: allow caller to control button label (MVP)
  confirmLabel?: string;

  // Optional: allow caller to override dialog title (nice for inbound vs outbound)
  title?: string;
};

// -----------------------------------------------------------------------------
// Constants + helpers
// -----------------------------------------------------------------------------

const DEFAULT_FORM: TransferPatientData = {
  type: "Same episode",
  fromFacility: "",
  fromUnit: "",
  toFacility: "",
  toUnit: "",
  transferDate: "",
  transferTime: "",
  technicalUnit: "",
  specialBedNeeds: "",
  reason: "",
  transferDecided: false,
  patientReady: false,
};

function nowDateTimeParts() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const hh = `${now.getHours()}`.padStart(2, "0");
  const mm = `${now.getMinutes()}`.padStart(2, "0");
  return { date, time: `${hh}:${mm}` };
}

function splitTransferTime(transferTime?: string) {
  const { date: defaultDate, time: defaultTime } = nowDateTimeParts();
  if (!transferTime) return { date: defaultDate, time: defaultTime };

  const [d, t] = transferTime.split(" ");
  return {
    date: d || defaultDate,
    time: t || defaultTime,
  };
}

function normalizeType(raw: unknown): TransferPatientData["type"] {
  if (raw === "Other hospital") return "Other hospital";
  if (raw === "New episode") return "New episode";
  return "Same episode";
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const TransferPatientDialog: React.FC<TransferPatientDialogProps> = ({
  open,
  transfer,
  facilityOptions,
  unitsByFacility,
  onClose,
  onTransfer,
  confirmLabel = "Save",
  title = "Plan transfer",
}) => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [form, setForm] = useState<TransferPatientData>(DEFAULT_FORM);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const availableFromUnits = useMemo(() => {
    return unitsByFacility[form.fromFacility] || [];
  }, [form.fromFacility, unitsByFacility]);

  const availableToUnits = useMemo(() => {
    return unitsByFacility[form.toFacility] || [];
  }, [form.toFacility, unitsByFacility]);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open || !transfer) return;

    const { date, time } = splitTransferTime(transfer.transferTime);

    setForm({
      type: normalizeType((transfer as any).type),
      fromFacility: transfer.fromFacility || "",
      fromUnit: transfer.fromUnit || "",
      toFacility: transfer.toFacility || "",
      toUnit: transfer.toUnit || "",
      transferDate: date,
      transferTime: time,
      technicalUnit: transfer.technicalUnit || "",
      specialBedNeeds: transfer.specialBedNeeds || "",
      reason: transfer.reason || "",
      transferDecided: Boolean(transfer.transferDecided),
      patientReady: Boolean(transfer.patientReady),
    });
  }, [open, transfer]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const setField = <K extends keyof TransferPatientData>(field: K, value: TransferPatientData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange =
    (field: keyof TransferPatientData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(field as any, e.target.value as any);
    };

  const handleCheckChange =
    (field: "transferDecided" | "patientReady") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField(field, e.target.checked);
    };

  const handleFacilityChange =
    (field: "fromFacility" | "toFacility") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const facility = e.target.value;

      setForm((prev) => {
        const next = { ...prev, [field]: facility } as TransferPatientData;

        if (field === "fromFacility") {
          const valid = (unitsByFacility[facility] || []).includes(next.fromUnit);
          if (!valid) next.fromUnit = "";
        }

        if (field === "toFacility") {
          const valid = (unitsByFacility[facility] || []).includes(next.toUnit);
          if (!valid) next.toUnit = "";
        }

        return next;
      });
    };

  const handleSave = () => onTransfer(form);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {!transfer ? null : (
          <div className="mt-2 space-y-3 text-sm">
            <div>
              <span className="font-semibold">Patient: </span>
              {transfer.name} ({transfer.nationalId})
            </div>

            {/* Type */}
            <div>
              <div className="mb-1 text-xs font-semibold text-gray-700">Type of transfer</div>
              <RadioGroup
                row
                value={form.type}
                onChange={(e) => setField("type", e.target.value as TransferPatientData["type"])}
              >
                <FormControlLabel value="Same episode" control={<Radio size="small" />} label="Same episode" />
                <FormControlLabel value="New episode" control={<Radio size="small" />} label="New episode" />
                <FormControlLabel value="Other hospital" control={<Radio size="small" />} label="Other hospital" />
              </RadioGroup>
            </div>

            {/* FROM */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <TextField
                label="Transfer from facility"
                size="small"
                select
                fullWidth
                value={form.fromFacility}
                onChange={handleFacilityChange("fromFacility")}
              >
                {facilityOptions.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Transfer from unit"
                size="small"
                select
                fullWidth
                value={form.fromUnit}
                onChange={handleTextChange("fromUnit")}
                disabled={!form.fromFacility}
              >
                {availableFromUnits.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* TO */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <TextField
                label="Transfer to facility"
                size="small"
                select
                fullWidth
                value={form.toFacility}
                onChange={handleFacilityChange("toFacility")}
              >
                {facilityOptions.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Transfer to unit"
                size="small"
                select
                fullWidth
                value={form.toUnit}
                onChange={handleTextChange("toUnit")}
                disabled={!form.toFacility}
              >
                {availableToUnits.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Date/time */}
            <div className="flex gap-2">
              <TextField
                label="Planned date"
                type="date"
                size="small"
                value={form.transferDate}
                onChange={handleTextChange("transferDate")}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                type="time"
                size="small"
                value={form.transferTime}
                onChange={handleTextChange("transferTime")}
                InputLabelProps={{ shrink: true }}
              />
            </div>

            {/* Optional fields */}
            <TextField
              label="Technical unit (optional)"
              size="small"
              fullWidth
              value={form.technicalUnit}
              onChange={handleTextChange("technicalUnit")}
            />
            <TextField
              label="Special bed needs (optional)"
              size="small"
              fullWidth
              value={form.specialBedNeeds}
              onChange={handleTextChange("specialBedNeeds")}
            />

            <TextField
              label="Reason / referral note (optional)"
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={form.reason}
              onChange={handleTextChange("reason")}
            />

            {/* Checkboxes */}
            <div className="mt-1 space-y-1">
              <FormControlLabel
                control={<Checkbox checked={form.transferDecided} onChange={handleCheckChange("transferDecided")} size="small" />}
                label="Transfer decided"
              />
              <FormControlLabel
                control={<Checkbox checked={form.patientReady} onChange={handleCheckChange("patientReady")} size="small" />}
                label="Patient ready to transfer"
              />
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferPatientDialog;
