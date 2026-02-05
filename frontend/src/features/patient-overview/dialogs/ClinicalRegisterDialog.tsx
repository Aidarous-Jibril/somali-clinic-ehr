// src/components/patient-overview/dialogs/ClinicalRegisterDialog.tsx
import React from "react";
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
  Stack,
  TextField,
} from "@mui/material";
import type { ClinicalRegisterForm, ConsciousnessOption } from "../../../features/patient-overview/types";

type Props = {
  open: boolean;
  form: ClinicalRegisterForm;
  setForm: React.Dispatch<React.SetStateAction<ClinicalRegisterForm>>;
  consciousnessOptions: ConsciousnessOption[];
  onClose: () => void;
  onRegister: () => void;
};

export const ClinicalRegisterDialog: React.FC<Props> = ({
  open,
  form,
  setForm,
  consciousnessOptions,
  onClose,
  onRegister,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Record clinical parameters</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <TextField label="Vårdkontakt" size="small" select defaultValue="Mottagningsbesök">
              <MenuItem value="Mottagningsbesök">Reception visit</MenuItem>
              <MenuItem value="Vårdtillfälle">Care occasion</MenuItem>
            </TextField>

            <TextField label="Vårdpersonal" size="small" select defaultValue="Johan Svärd, Leg Läkare">
              <MenuItem value="Johan Svärd, Leg Läkare">Johan Svärd, Leg Läkare</MenuItem>
              <MenuItem value="Anna Andersson, SSK">Anna Andersson, SSK</MenuItem>
            </TextField>

            <TextField label="Enhet" size="small" select defaultValue="Medic avd 1">
              <MenuItem value="Medic avd 1">Medic dep 1</MenuItem>
              <MenuItem value="Stroke ward">Stroke ward</MenuItem>
            </TextField>

            <TextField
              label="Händelsedatum"
              size="small"
              value={form.dateTime}
              onChange={(e) => setForm((prev) => ({ ...prev, dateTime: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <TextField
              label="NEWS2"
              size="small"
              type="number"
              value={form.news2}
              onChange={(e) => setForm((prev) => ({ ...prev, news2: e.target.value }))}
            />
            <TextField
              label="Respiratory rate (/min)"
              size="small"
              type="number"
              value={form.respiratoryRate}
              onChange={(e) => setForm((prev) => ({ ...prev, respiratoryRate: e.target.value }))}
            />
            <TextField
              label="Pulse (beats/min)"
              size="small"
              type="number"
              value={form.pulseRate}
              onChange={(e) => setForm((prev) => ({ ...prev, pulseRate: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <TextField
              label="SpO₂ (%)"
              size="small"
              type="number"
              value={form.oxygenSaturation}
              onChange={(e) => setForm((prev) => ({ ...prev, oxygenSaturation: e.target.value }))}
            />

            <div className="flex items-center gap-2">
              <RadioGroup
                row
                value={form.hasOxygen}
                onChange={(e) => setForm((prev) => ({ ...prev, hasOxygen: e.target.value as "yes" | "no" }))}
              >
                <FormControlLabel value="no" control={<Radio size="small" />} label="Ingen O₂" />
                <FormControlLabel value="yes" control={<Radio size="small" />} label="O₂" />
              </RadioGroup>

              {form.hasOxygen === "yes" ? (
                <TextField
                  label="Flow (L/min)"
                  size="small"
                  type="number"
                  value={form.oxygenLiters}
                  onChange={(e) => setForm((prev) => ({ ...prev, oxygenLiters: e.target.value }))}
                  sx={{ maxWidth: 140 }}
                />
              ) : null}
            </div>

            <TextField
              label="Temp (°C)"
              size="small"
              type="number"
              value={form.temperature}
              onChange={(e) => setForm((prev) => ({ ...prev, temperature: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <TextField
              label="Systolic BP (mmHg)"
              size="small"
              type="number"
              value={form.systolicBP}
              onChange={(e) => setForm((prev) => ({ ...prev, systolicBP: e.target.value }))}
            />
            <TextField
              label="Diastolic BP (mmHg)"
              size="small"
              type="number"
              value={form.diastolicBP}
              onChange={(e) => setForm((prev) => ({ ...prev, diastolicBP: e.target.value }))}
            />
            <TextField
              label="AVPU"
              size="small"
              select
              value={form.consciousness}
              onChange={(e) => setForm((prev) => ({ ...prev, consciousness: e.target.value }))}
            >
              {consciousnessOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <TextField
            label="Comment (optional)"
            size="small"
            value={form.note}
            onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onRegister}>
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};
