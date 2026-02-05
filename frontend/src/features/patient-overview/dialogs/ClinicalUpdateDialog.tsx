// src/components/patient-overview/dialogs/ClinicalUpdateDialog.tsx
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import type { ClinicalParameterName, ClinicalUpdateForm } from "../../../features/patient-overview/types";

type Props = {
  open: boolean;
  name: ClinicalParameterName;
  form: ClinicalUpdateForm;
  setForm: React.Dispatch<React.SetStateAction<ClinicalUpdateForm>>;
  onClose: () => void;
  onSave: () => void;
};

export const ClinicalUpdateDialog: React.FC<Props> = ({ open, name, form, setForm, onClose, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Uppdatera klinisk parameter: {name}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Datum / tid"
            size="small"
            value={form.dateTime}
            onChange={(e) => setForm((p) => ({ ...p, dateTime: e.target.value }))}
          />

          <TextField
            label="Värde"
            size="small"
            value={form.value}
            onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
            helperText={
              name === "Blood pressure"
                ? "Format: systoliskt/diastoliskt (t.ex. 136/89)"
                : name === "SpO₂"
                ? "Ange procent (t.ex. 95)"
                : undefined
            }
          />

          {name === "SpO₂" ? (
            <TextField
              label="O₂ (t.ex. 0 L / 2 L)"
              size="small"
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            />
          ) : (
            <TextField
              label="Kommentar (valfritt)"
              size="small"
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Avbryt</Button>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
