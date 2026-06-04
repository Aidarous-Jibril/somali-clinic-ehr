//src/features/patient-overview/dialogs/AddReferralDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { useAuth } from "../../../context/AuthContext";
import { useClinics } from "../../../hooks/staff/useClinics";
import { useUnits } from "../../../hooks/staff/useUnits";

/* ================= TYPES ================= */
type ReferralForm = {
  toClinicId?: string;
  toUnitId?: string;
  urgent: boolean;
  hasAdditionalInfo: boolean;
  details: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (referral: any) => void;
};

/* ================= INITIAL STATE ================= */
const initialForm: ReferralForm = {
  toClinicId: undefined,
  toUnitId: undefined,
  urgent: false,
  hasAdditionalInfo: false,
  details: "",
};

/* ================= COMPONENT ================= */
export const AddReferralDialog: React.FC<Props> = ({ open, onClose, onSave, }) => {
  const { user } = useAuth();
  const { data: clinics = [] } = useClinics();

  const [form, setForm] = useState<ReferralForm>(initialForm);

  // dynamic units
  const { data: toUnits = [] } = useUnits(form.toClinicId);
  const { data: fromUnits = [] } = useUnits(user?.clinicId);

  /* ================= RESET ON OPEN ================= */
  useEffect(() => {
    if (open) {
      setForm(initialForm);
    }
  }, [open]);

  /* ================= HANDLERS ================= */
  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (!user || !form.toUnitId) return;

    onSave({
      toUnitId: form.toUnitId,
      // sentByStaffId: user.id,
      // fromClinicId: user.clinicId,
      // fromUnitId: user.unitId,
      urgent: form.urgent,
      hasAdditionalInfo: form.hasAdditionalInfo,
      details: form.details,
    });
  };

  /* ================= RENDER ================= */
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create referral</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* ===== TO CLINIC ===== */}
          <TextField
            label="To clinic"
            size="small"
            select
            value={form.toClinicId ?? ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                toClinicId: e.target.value,
                toUnitId: undefined, // reset unit when clinic changes
              }))
            }
            fullWidth
          >
            {clinics.map((c: any) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          {/* ===== TO UNIT ===== */}
          <TextField
            label="To unit"
            size="small"
            select
            value={form.toUnitId ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, toUnitId: e.target.value }))
            }
            fullWidth
            disabled={!form.toClinicId}
          >
            {toUnits
              .filter((u: any) => u.id !== user?.unitId)
              .map((u: any) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
          </TextField>

          {/* ===== FROM CLINIC ===== */}
          <TextField
            label="From clinic"
            size="small"
            value={
              clinics.find((c: any) => c.id === user?.clinicId)?.name || ""
            }
            fullWidth
            disabled
          />

          {/* ===== FROM UNIT ===== */}
          <TextField
            label="From unit"
            size="small"
            value={
              fromUnits.find((u: any) => u.id === user?.unitId)?.name || ""
            }
            fullWidth
            disabled
          />

          {/* ===== USER ===== */}
          <TextField
            label="Responsible clinician"
            size="small"
            value={`${user?.name} — ${user?.role}`}
            fullWidth
            disabled
          />

          {/* ===== FLAGS ===== */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.urgent}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, urgent: e.target.checked }))
                  }
                />
              }
              label="Urgent"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.hasAdditionalInfo}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      hasAdditionalInfo: e.target.checked,
                    }))
                  }
                />
              }
              label="Has complementary answer"
            />
          </Stack>

          {/* ===== DETAILS ===== */}
          <TextField
            label="Details"
            size="small"
            value={form.details}
            onChange={(e) =>
              setForm((p) => ({ ...p, details: e.target.value }))
            }
            multiline
            minRows={3}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};