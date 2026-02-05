// src/components/patient-overview/dialogs/AttentionSignalCreateDialog.tsx
import React, { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type {
  AttentionCategory,
  AttentionSignalCertainty,
  AttentionSignalEntry,
  AttentionSignalSeverity,
} from "../../../features/patient-overview/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (entry: AttentionSignalEntry) => void;
};

const categories: AttentionCategory[] = [
  "Hypersensitivity",
  "Medical Condition and Treatment",
  "Infection",
  "Non-routine Care Deviation",
]; 

const severityOptions: AttentionSignalSeverity[] = ["Mild", "Moderate", "Severe", "Harmful"];
const certaintyOptions: AttentionSignalCertainty[] = ["Suspected", "Probable", "Confirmed"];

export const AttentionSignalCreateDialog: React.FC<Props> = ({ open, onClose, onCreate }) => {
  const now = useMemo(() => new Date().toLocaleString("sv-SE"), []);
  const [category, setCategory] = useState<AttentionCategory>("Hypersensitivity");
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<AttentionSignalSeverity>("Mild");
  const [certainty, setCertainty] = useState<AttentionSignalCertainty>("Confirmed");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;

    onCreate({
      id: `att-${Math.random().toString(36).slice(2, 9)}`,
      category,
      title: title.trim(),
      status: "active",
      assessedAt: now,
      assessedBy: "Johan Svärd",
      unit: "Medicin avd 1",
      severity,
      certainty,
      description: description.trim() || undefined,
    });

    // reset
    setTitle("");
    setDescription("");
    setCategory("Hypersensitivity");
    setSeverity("Mild");
    setCertainty("Confirmed");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create new registration (Attention signal)</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Kategori"
            size="small"
            select
            value={category}
            onChange={(e) => setCategory(e.target.value as AttentionCategory)}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Rubrik"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="t.ex. Latex"
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Allvarlighetsgrad"
              size="small"
              select
              fullWidth
              value={severity}
              onChange={(e) => setSeverity(e.target.value as AttentionSignalSeverity)}
            >
              {severityOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Visshetsgrad"
              size="small"
              select
              fullWidth
              value={certainty}
              onChange={(e) => setCertainty(e.target.value as AttentionSignalCertainty)}
            >
              {certaintyOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField
            label="Beskrivning (valfritt)"
            size="small"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
