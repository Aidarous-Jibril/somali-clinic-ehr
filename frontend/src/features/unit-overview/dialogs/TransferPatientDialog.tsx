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

import { useAuth } from "../../../context/AuthContext";
import { useClinics } from "../../../hooks/staff/useClinics";
import { useUnits } from "../../../hooks/staff/useUnits";

import type { Transfer, TransferPatientData } from "../types";

type Props = {
  open: boolean;
  transfer: Transfer | null;
  onClose: () => void;
  onTransfer: (data: TransferPatientData) => void;
  confirmLabel?: string;
  title?: string;
};

const EMPTY_FORM: TransferPatientData = {
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

function getNowParts() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");

  return {
    date: `${yyyy}-${mm}-${dd}`,
    time: `${hh}:${min}`,
  };
}

export default function TransferPatientDialog({
  open,
  transfer,
  onClose,
  onTransfer,
  confirmLabel = "Save",
  title = "Plan transfer",
}: Props) {
  const { user } = useAuth();

  const { data: clinics = [] } = useClinics();
  const { data: ownUnits = [] } = useUnits(user?.clinicId);
  const [targetClinicId, setTargetClinicId] = useState("");
  const { data: targetUnits = [] } = useUnits(targetClinicId);

  const [form, setForm] =
    useState<TransferPatientData>(EMPTY_FORM);

  // Logged in clinic name
  const ownClinicName =
    clinics.find((c: any) => c.id === user?.clinicId)?.name || "";

  // Logged in unit name
  const ownUnitName =
    ownUnits.find((u: any) => u.id === user?.unitId)?.name ||
    user?.unitName ||
    "";

  // Exclude own clinic for external transfer
  const clinicOptions = useMemo(() => {
    if (form.type === "Other hospital") {
      return clinics.filter(
        (c: any) => c.id !== user?.clinicId
      );
    }

    return clinics;
  }, [clinics, form.type, user?.clinicId]);

  // Units based on selected clinic
  const unitOptions = useMemo(() => {
    if (!targetClinicId) return [];

    // same clinic => exclude current unit
    if (targetClinicId === user?.clinicId) {
      return targetUnits.filter(
        (u: any) => u.id !== user?.unitId
      );
    }

    return targetUnits;
  }, [
    targetClinicId,
    targetUnits,
    user?.clinicId,
    user?.unitId,
  ]);

  useEffect(() => {
    if (!open || !transfer) return;

    const { date, time } = getNowParts();

    setTargetClinicId("");

    setForm({
      type: "Same episode",
      fromFacility: ownClinicName,
      fromUnit: ownUnitName,
      toFacility: "",
      toUnit: "",
      transferDate: date,
      transferTime: time,
      technicalUnit: "",
      specialBedNeeds: "",
      reason: "",
      transferDecided: false,
      patientReady: false,
    });
  }, [
    open,
    transfer,
    ownClinicName,
    ownUnitName,
  ]);

  const setField = (
    key: keyof TransferPatientData,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onTransfer(form);
  };

  if (!transfer) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <div className="space-y-4 text-sm">

          {/* Patient */}
          <div>
            <span className="font-semibold">Patient: </span>
            {transfer.name} ({transfer.nationalId})
          </div>

          {/* Type */}
          <div>
            <div className="mb-1 text-xs font-semibold text-gray-700">
              Type of transfer
            </div>

            <RadioGroup
              row
              value={form.type}
              onChange={(e) => {
                setTargetClinicId("");
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as any,
                  toFacility: "",
                  toUnit: "",
                }));
              }}
            >
              <FormControlLabel
                value="Same episode"
                control={<Radio />}
                label="Same episode"
              />

              <FormControlLabel
                value="New episode"
                control={<Radio />}
                label="New episode"
              />

              <FormControlLabel
                value="Other hospital"
                control={<Radio />}
                label="Other hospital"
              />
            </RadioGroup>
          </div>

          {/* From */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Transfer from clinic"
              size="small"
              fullWidth
              value={form.fromFacility}
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Transfer from unit"
              size="small"
              fullWidth
              value={form.fromUnit}
              InputProps={{ readOnly: true }}
            />
          </div>

          {/* To */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Transfer to clinic"
              size="small"
              select
              fullWidth
              value={targetClinicId}
              onChange={(e) => {
                const clinicId = e.target.value;

                setTargetClinicId(clinicId);

                const clinic = clinics.find(
                  (c: any) => c.id === clinicId
                );

                setForm((prev) => ({
                  ...prev,
                  toFacility: clinic?.name || "",
                  toUnit: "",
                }));
              }}
            >
              {clinicOptions.map((clinic: any) => (
                <MenuItem
                  key={clinic.id}
                  value={clinic.id}
                >
                  {clinic.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Transfer to unit"
              size="small"
              select
              fullWidth
              disabled={!targetClinicId}
              value={form.toUnit}
              onChange={(e) =>
                setField("toUnit", e.target.value)
              }
            >
              {unitOptions.map((unit: any) => (
                <MenuItem
                  key={unit.id}
                  value={unit.name}
                >
                  {unit.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Date / Time */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Planned date"
              type="date"
              size="small"
              fullWidth
              value={form.transferDate}
              onChange={(e) =>
                setField("transferDate", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Time"
              type="time"
              size="small"
              fullWidth
              value={form.transferTime}
              onChange={(e) =>
                setField("transferTime", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <TextField
            label="Technical unit (optional)"
            size="small"
            fullWidth
            value={form.technicalUnit}
            onChange={(e) =>
              setField("technicalUnit", e.target.value)
            }
          />

          <TextField
            label="Special bed needs (optional)"
            size="small"
            fullWidth
            value={form.specialBedNeeds}
            onChange={(e) =>
              setField("specialBedNeeds", e.target.value)
            }
          />

          <TextField
            label="Reason / referral note (optional)"
            size="small"
            fullWidth
            multiline
            minRows={3}
            value={form.reason}
            onChange={(e) =>
              setField("reason", e.target.value)
            }
          />

          <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.transferDecided}
                  onChange={(e) =>
                    setField(
                      "transferDecided",
                      e.target.checked
                    )
                  }
                />
              }
              label="Transfer decided"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.patientReady}
                  onChange={(e) =>
                    setField(
                      "patientReady",
                      e.target.checked
                    )
                  }
                />
              }
              label="Patient ready to transfer"
            />
          </div>

        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!form.toFacility || !form.toUnit}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}