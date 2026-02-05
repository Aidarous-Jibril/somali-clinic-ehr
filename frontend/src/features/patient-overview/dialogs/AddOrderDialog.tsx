// src/features/patient-overview/dialogs/AddOrderDialog.tsx
import React, { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { OrderForm } from "../../../features/patient-overview/types";

type Props = {
  open: boolean;
  form: OrderForm;
  setForm: React.Dispatch<React.SetStateAction<OrderForm>>;
  onClose: () => void;
  onSave: () => void;
  mode?: "create" | "edit";
};

const CARE_CONTACTS = [
  "2023-10-31, Ward stay, Medical ward 1, Medicine clinic, Nässjö",
  "2024-09-02, Ward stay, Stroke ward, Mora Lasarett",
  "2025-10-22, Outpatient visit, Medicine clinic",
];

const ORDERING_UNITS = [
  "Stroke ward",
  "Medical ward 1",
  "Medical ward 2",
  "Emergency department",
];

const ORDERED_BY_UNITS = [
  "Stroke ward",
  "Medical ward 2",
  "Outpatient clinic North",
  "Emergency department",
];

const ANALYSIS_BY_CATEGORY: Record<string, string[]> = {
  Chemistry: ["P-CRP", "B-Hb", "B-HbA1c (IFCC)", "P-Albumin", "P-Potassium"],
  Hematology: ["B-Neutrophils", "B-Platelets", "B-EVF"],
  Microbiology: ["Urine culture", "Blood culture", "Wound culture", "Stool culture"],
  Radiology: ["Chest X-ray", "CT brain", "Ultrasound abdomen"],
  Endoscopy: ["Gastroscopy (EGD)", "Colonoscopy"],
  "Clinical parameters": [
    "NEWS2",
    "AVPU",
    "Respiratory rate",
    "SpO₂",
    "Pulse",
    "Blood pressure",
    "Body temperature",
  ],
  Tasks: [
    "Insert PVK",
    "Flush IV line",
    "Oxygen therapy",
    "Wound care",
    "Urine collection",
    "Telemetry",
    "Physio training",
  ],
  Other: ["EKG", "Physio assessment", "Dietician assessment"],
};

export const AddOrderDialog: React.FC<Props> = ({
  open,
  form,
  setForm,
  onClose,
  onSave,
  mode = "create",
}) => {
  const analysisOptions = useMemo(() => {
    const key = form.category || "Chemistry";
    return ANALYSIS_BY_CATEGORY[key] ?? [];
  }, [form.category]);

  const canSave = Boolean(
    form.category?.trim() && form.name?.trim() && form.orderedBy?.trim() && form.date?.trim()
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        {mode === "edit" ? "Edit order" : "New lab / radiology order"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
          Shared information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <TextField
              label="Ordering care contact"
              size="small"
              select
              fullWidth
              value={form.careContact ?? CARE_CONTACTS[0]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, careContact: e.target.value }))
              }
            >
              {CARE_CONTACTS.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Ordering unit"
              size="small"
              select
              fullWidth
              value={form.orderingUnit ?? ORDERING_UNITS[0]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, orderingUnit: e.target.value }))
              }
            >
              {ORDERING_UNITS.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {/* Base fields */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <TextField
                label="Category"
                size="small"
                select
                value={form.category}
                onChange={(e) => {
                  const category = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    category,
                    name: (ANALYSIS_BY_CATEGORY[category] ?? []).includes(prev.name)
                      ? prev.name
                      : "",
                  }));
                }}
              >
                <MenuItem value="Chemistry">Chemistry</MenuItem>
                <MenuItem value="Hematology">Hematology</MenuItem>
                <MenuItem value="Microbiology">Microbiology</MenuItem>
                <MenuItem value="Radiology">Radiology</MenuItem>
                <MenuItem value="Endoscopy">Endoscopy</MenuItem>
                <MenuItem value="Clinical parameters">Clinical parameters</MenuItem>
                <MenuItem value="Tasks">Tasks</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>

              <TextField
                label="Analysis / exam"
                size="small"
                select
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                disabled={!analysisOptions.length}
              >
                {analysisOptions.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Ordered by (unit / clinic)"
                size="small"
                select
                value={form.orderedBy}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, orderedBy: e.target.value }))
                }
              >
                {ORDERED_BY_UNITS.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Date"
                size="small"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                placeholder="YYYY-MM-DD"
              />
            </Stack>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                Order details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <TextField
                    label="Planned date"
                    size="small"
                    fullWidth
                    value={form.plannedDate ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, plannedDate: e.target.value }))
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Time"
                    size="small"
                    fullWidth
                    value={form.plannedTime ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, plannedTime: e.target.value }))
                    }
                    placeholder="HH:mm"
                  />
                </Grid>
              </Grid>

              <TextField
                label="Repeat"
                size="small"
                select
                value={form.repeat ?? "Never"}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, repeat: e.target.value as any }))
                }
              >
                <MenuItem value="Never">Never</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </TextField>

              <TextField
                label="Requester"
                size="small"
                value={form.requester ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, requester: e.target.value }))
                }
                placeholder="e.g. Falk, Lova"
              />

              <TextField
                label="Performer"
                size="small"
                value={form.performer ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, performer: e.target.value }))
                }
                placeholder="(All)"
              />

              <TextField
                label="Addition"
                size="small"
                value={form.addition ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, addition: e.target.value }))
                }
              />

              <TextField
                label="Comment"
                size="small"
                value={form.comment ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, comment: e.target.value }))
                }
                multiline
                minRows={3}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={onSave} disabled={!canSave}>
          {mode === "edit" ? "Save changes" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
