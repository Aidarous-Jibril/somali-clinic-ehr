// src/components/medications/vaccinations/RegisterVaccinationDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useCreateVaccination } from "../../../hooks/vaccination/useCreateVaccination";
import { DOSE_OPTIONS, VACCINE_OPTIONS } from "../../../features/medications/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: string;
}

export function RegisterVaccinationDialog({ open, onClose, patientId, }: Props) {
  const { mutate: createVaccination, isPending } = useCreateVaccination();

  const [vaccineName, setVaccineName] = useState("");
  const [dose, setDose] = useState("");

  const handleSave = () => {
    if (!vaccineName.trim()) return;

    createVaccination(
      {
        patientId,
        vaccineName: vaccineName.trim(),
        dose: dose.trim() || undefined,
      },
      {
        onSuccess: () => {
          setVaccineName("");
          setDose("");
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setVaccineName("");
    setDose("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Register Vaccination</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Autocomplete
            options={[...VACCINE_OPTIONS]}
            value={vaccineName}
            onChange={(_, value) => setVaccineName(value ?? "")}
            freeSolo
            renderInput={(params) => (
                <TextField
                {...params}
                label="Vaccine Name"
                required
                fullWidth
                />
            )}
            />

          <FormControl fullWidth>
            <InputLabel>Dose</InputLabel>
            <Select
                value={dose}
                label="Dose"
                onChange={(e) => setDose(e.target.value)}
            >
                {DOSE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                    {option || "Not specified"}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!vaccineName.trim() || isPending}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}