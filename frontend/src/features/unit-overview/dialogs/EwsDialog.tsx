//src/features/unit-overview/dialogs/EwsDialog.tsx
import { useEffect, useState } from "react";
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
import { toast } from "react-toastify";

import type { Inpatient } from "../types";
import { useCreateClinicalEntry } from "../../../hooks/journal/useCreateClinicalEntry";

type Props = {
  open: boolean;
  patient: Inpatient | null;
  onClose: () => void;
  onSaved?: () => void;
};

type FormState = {
  respiratoryRate: string;
  spo2: string;
  pulse: string;
  systolic: string;
  diastolic: string;
  temperature: string;
  consciousness: string;
  score: string;
  comment: string;
  oxygen: "no" | "yes";
};

const emptyForm: FormState = {
  respiratoryRate: "",
  spo2: "",
  pulse: "",
  systolic: "",
  diastolic: "",
  temperature: "",
  consciousness: "alert",
  score: "",
  comment: "",
  oxygen: "no",
};

export default function EwsDialog({
  open,
  patient,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const mutation = useCreateClinicalEntry();

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));

  const saveEntry = async (
    name: string,
    value: string
  ) => {
    if (!patient?.encounterId || !value) return;

    await mutation.mutateAsync({
      encounterId: patient.encounterId,
      name,
      value,
      note: form.comment || undefined,
    });
  };

  const handleSave = async () => {
    try {
      if (!patient?.encounterId) {
        toast.error("Missing encounter");
        return;
      }

      await Promise.all([
        saveEntry("NEWS2", form.score),
        saveEntry(
          "respiratory_rate",
          form.respiratoryRate
        ),
        saveEntry("spo2", form.spo2),
        saveEntry("pulse", form.pulse),
        saveEntry(
          "blood_pressure",
          `${form.systolic}/${form.diastolic}`
        ),
        saveEntry("temperature", form.temperature),
        saveEntry(
          "consciousness",
          form.consciousness
        ),
      ]);

      toast.success("NEWS/EWS saved");
      onSaved?.();
      onClose();
    } catch {
      toast.error("Failed to save NEWS/EWS");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add EWS / NEWS</DialogTitle>

      <DialogContent className="space-y-4 pt-2">
        {patient && (
          <div className="font-medium">
            Patient: {patient.name} ({patient.nationalId})
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TextField
            label="NEWS2"
            size="small"
            value={form.score}
            onChange={setField("score")}
          />

          <TextField
            label="Respiratory rate"
            size="small"
            value={form.respiratoryRate}
            onChange={setField("respiratoryRate")}
          />

          <TextField
            label="Pulse"
            size="small"
            value={form.pulse}
            onChange={setField("pulse")}
          />

          <TextField
            label="SpO₂"
            size="small"
            value={form.spo2}
            onChange={setField("spo2")}
          />

          <TextField
            label="Temperature"
            size="small"
            value={form.temperature}
            onChange={setField("temperature")}
          />

          <TextField
            select
            label="Consciousness"
            size="small"
            value={form.consciousness}
            onChange={setField("consciousness")}
          >
            <MenuItem value="alert">Alert</MenuItem>
            <MenuItem value="voice">Voice</MenuItem>
            <MenuItem value="pain">Pain</MenuItem>
            <MenuItem value="unresponsive">
              Unresponsive
            </MenuItem>
          </TextField>

          <TextField
            label="Systolic BP"
            size="small"
            value={form.systolic}
            onChange={setField("systolic")}
          />

          <TextField
            label="Diastolic BP"
            size="small"
            value={form.diastolic}
            onChange={setField("diastolic")}
          />
        </div>

        <RadioGroup
          row
          value={form.oxygen}
          onChange={setField("oxygen")}
        >
          <FormControlLabel
            value="no"
            control={<Radio />}
            label="No O₂"
          />
          <FormControlLabel
            value="yes"
            control={<Radio />}
            label="O₂"
          />
        </RadioGroup>

        <TextField
          label="Comment"
          fullWidth
          multiline
          minRows={2}
          value={form.comment}
          onChange={setField("comment")}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={mutation.isPending}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}