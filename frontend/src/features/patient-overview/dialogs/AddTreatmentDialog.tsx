// src/features/patient-overview/dialogs/AddTreatmentDialog.tsx

import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  Divider,
  MenuItem,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import { useCreateMedication } from "../../../hooks/medications/useCreateMedication";
import { useCreateVaccination } from "../../../hooks/vaccination/useCreateVaccination";
import { useAuth } from "../../../context/AuthContext";

/* ========= TYPES ========= */
type Props = {
  open: boolean;
  onClose: () => void;
  type: "medications" | "vaccinations";
  patientId: string;
  clinicId: string;
  encounterId?: string;
};

/* ========= COMPONENT ========= */
export const AddTreatmentDialog: React.FC<Props> = ({
  open,
  onClose,
  type,
  patientId,
  clinicId,
  encounterId,
}) => {
  const qc = useQueryClient();
  const { user } = useAuth();

  const createMedicationMutation = useCreateMedication();
  const createVaccinationMutation = useCreateVaccination();

  const isVaccination = type === "vaccinations";

  /* ===== INITIAL STATE ===== */
  const initialForm = {
    name: "",
    dose: "",
    manufacturer: "",
    notes: "",
    frequency: "once_daily", 
    strength: "",
  };
  const [form, setForm] = useState(initialForm);
  const resetForm = () => setForm(initialForm);

  /* ===== VALIDATION ===== */
  const canSave = Boolean(form.name.trim() && form.dose.trim());

  const isLoading =
    createMedicationMutation.isPending ||
    createVaccinationMutation.isPending;

  /* ===== CLOSE ===== */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = () => {
    if (!canSave) return;

    // 🔐 Healthcare rule
    if (!encounterId) {
      toast.error("Start an encounter before registering treatment");
      return;
    }

    if (isVaccination) {
      createVaccinationMutation.mutate(
        {
          clinicId,
          patientId,
          encounterId,
          vaccineName: form.name,
          dose: form.dose,
          manufacturer: form.manufacturer,
          notes: form.notes,
        },
        {
          onSuccess: () => {
            qc.invalidateQueries({
              queryKey: ["vaccinations", patientId],
            });
            resetForm();
            onClose();
          },
        }
      );
    } else {
      createMedicationMutation.mutate(
        {
          clinicId,
          patientId,
          encounterId,
          name: form.name,
          dose: form.dose,
          frequency: form.frequency, 
          strength: form.strength,
          notes: form.notes,
        },
        {
          onSuccess: () => {
            qc.invalidateQueries({
              queryKey: ["medications", patientId],
            });
            resetForm();
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {/* ===== HEADER ===== */}
      <DialogTitle sx={{ pb: 1 }}>
        {isVaccination ? "New vaccination" : "New medication"}

        <Typography
          variant="caption"
          sx={{ display: "block", mt: 0.5, color: "text.secondary" }}
        >
          Created by: {user?.name} • {user?.unitName}
        </Typography>
      </DialogTitle>

      {/* ===== CONTENT ===== */}
      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={2}>
              {/* Section */}
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                {isVaccination
                  ? "Vaccination details"
                  : "Medication details"}
              </Typography>

              {/* NAME */}
              <TextField
                autoFocus
                label={isVaccination ? "Vaccine name" : "Medication name"}
                size="small"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
              />

              {/* DOSE */}
              <TextField
                label="Dose"
                size="small"
                value={form.dose}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, dose: e.target.value }))
                }
                fullWidth
              />
              {!isVaccination && (
                <TextField
                    label="Strength"
                    size="small"
                    value={form.strength}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, strength: e.target.value }))
                    }
                    fullWidth
                    />
              )}

              {/* FREQUENCY (MEDICATION ONLY) */}
              {!isVaccination && (
                <TextField
                  label="Frequency"
                  size="small"
                  select
                  value={form.frequency}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                  fullWidth
                >
                  <MenuItem value="once_daily">Once daily</MenuItem>
                  <MenuItem value="twice_daily">Twice daily</MenuItem>
                  <MenuItem value="three_times_daily">
                    Three times daily
                  </MenuItem>
                  <MenuItem value="four_times_daily">
                    Four times daily
                  </MenuItem>
                  <MenuItem value="as_needed">As needed</MenuItem>
                </TextField>
              )}

              {/* MANUFACTURER (VACCINE ONLY) */}
              {isVaccination && (
                <TextField
                  label="Manufacturer"
                  size="small"
                  value={form.manufacturer}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      manufacturer: e.target.value,
                    }))
                  }
                  fullWidth
                />
              )}

              <Divider sx={{ my: 1 }} />

              {/* NOTES */}
              <TextField
                label="Notes"
                size="small"
                multiline
                minRows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                fullWidth
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSave || isLoading}
        >
          {isLoading
            ? "Saving..."
            : isVaccination
            ? "Save vaccination"
            : "Save medication"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTreatmentDialog;