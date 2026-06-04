// src/features/patient-overview/dialogs/AddOrderDialog.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

import type { Encounter, Order } from "../types";
import { useAuth } from "../../../context/AuthContext";

/* ================= ANALYSIS OPTIONS ================= */
const ANALYSIS_BY_CATEGORY: Record<string, string[]> = {
  Chemistry: ["P-CRP", "B-Hb", "B-HbA1c (IFCC)", "P-Albumin", "P-Potassium"],
  Hematology: ["B-Neutrophils", "B-Platelets", "B-EVF"],
  Microbiology: ["Urine culture", "Blood culture", "Wound culture", "Stool culture"],
  Radiology: ["Chest X-ray", "CT brain", "Ultrasound abdomen"],
  Other: ["EKG", "Physio assessment", "Dietician assessment"],
};

/* ================= TYPES ================= */
type OrderFormState = {
  category: string;
  name: string;
  date: string;
  plannedDate?: string;
  requester?: string;
  orderingUnit?: string;
  comment?: string;
};

type Props = {
  open: boolean;
  mode?: "create" | "edit" | "view";
  encounter?: Encounter;
  editingOrder?: Order | null;
  onClose: () => void;
  onSave: (data: OrderFormState) => void;
};

/* ================= COMPONENT ================= */
export const AddOrderDialog: React.FC<Props> = ({
  open,
  mode = "create",
  encounter,
  editingOrder,
  onClose,
  onSave,
}) => {
  const { user } = useAuth();
  const readOnly = mode === "view";

  const [form, setForm] = useState<OrderFormState>({
    category: "Chemistry",
    name: "",
    date: "",
    plannedDate: "",
    requester: "",
    orderingUnit: "",
    comment: "",
  });

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (!open) return;

    const today = new Date().toISOString().slice(0, 10);

    if (mode === "create") {
      setForm({
        category: "Chemistry",
        name: "",
        date: today,
        plannedDate: today,
        requester: user?.name || "",
        orderingUnit: user?.unitName || "",
        comment: "",
      });
    }

    if ((mode === "edit" || mode === "view") && editingOrder) {
      setForm({
        category: editingOrder.category || "Chemistry",
        name: editingOrder.name || "",
        date: editingOrder.date || today, // ✅ FIXED

        plannedDate: editingOrder.plannedDate || today,
        requester: editingOrder.requester || user?.name || "",
        orderingUnit: editingOrder.orderingUnit || user?.unitName || "",
        comment: editingOrder.comment || "",
      });
    }
  }, [open, mode, editingOrder, user]);

  /* ================= OPTIONS ================= */
  const analysisOptions = useMemo(() => {
    return ANALYSIS_BY_CATEGORY[form.category] ?? [];
  }, [form.category]);

  /* ================= VALIDATION ================= */
  const canSave =
    !!form.category?.trim() &&
    !!form.name?.trim();

  /* ================= HANDLERS ================= */
  const setField =
    (key: keyof OrderFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleCategoryChange = (category: string) => {
    setForm((prev) => ({
      ...prev,
      category,
      name: ANALYSIS_BY_CATEGORY[category]?.includes(prev.name)
        ? prev.name
        : "",
    }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        {mode === "edit"
          ? "Edit order"
          : mode === "view"
          ? "Order details"
          : "New order"}

        {encounter && (
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
            Encounter: {encounter.type} •{" "}
            {encounter.reason || "No reason specified"}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={3}>
          {/* LEFT */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <TextField
                label="Category"
                size="small"
                select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={readOnly}
              >
                {Object.keys(ANALYSIS_BY_CATEGORY).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Analysis / exam"
                size="small"
                select
                value={form.name}
                onChange={setField("name")}
                disabled={readOnly}
              >
                {analysisOptions.map((x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Order date"
                type="date"
                size="small"
                value={form.date}
                onChange={setField("date")}
                InputLabelProps={{ shrink: true }}
                disabled={readOnly}
              />
            </Stack>
          </Grid>

          {/* RIGHT */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">Order context</Typography>

              <TextField label="Requester" size="small" value={form.requester} disabled />
              <TextField label="Unit" size="small" value={form.orderingUnit} disabled />

              <Divider />

              <TextField
                label="Planned date"
                type="date"
                size="small"
                value={form.plannedDate}
                onChange={setField("plannedDate")}
                InputLabelProps={{ shrink: true }}
                disabled={readOnly}
              />

              <TextField
                label="Comment"
                size="small"
                multiline
                minRows={3}
                value={form.comment}
                onChange={setField("comment")}
                disabled={readOnly}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>

        {mode !== "view" && (
          <Button variant="contained" onClick={handleSave} disabled={!canSave}>
            Save order
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};