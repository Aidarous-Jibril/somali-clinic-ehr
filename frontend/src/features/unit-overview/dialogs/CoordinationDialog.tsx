// src/features/unit-overview/dialogs/CoordinationDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import type {
  ConsentValue,
  CoordinationData,
  Inpatient,
  RecipientType,
} from "../types";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

type Props = {
  open: boolean;
  patient: Inpatient | null;
  availableUnits: readonly string[];
  initialData?: CoordinationData;
  onClose: () => void;
  onSave: (data: CoordinationData) => void;
};

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const RECIPIENT_TYPES: RecipientType[] = [
  "Municipality",
  "Outpatient care",
  "Inpatient care",
  "Other actor",
];

const DEFAULT_FORM: CoordinationData = {
  infoSharingConsent: "notAsked",
  coordinationNeeded: "notAsked",
  sipConsent: "notAsked",
  adminComment: "",
  recipients: [],
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const makeFreshForm = (source?: CoordinationData): CoordinationData => {
  if (!source) return { ...DEFAULT_FORM, recipients: [] };

  return {
    infoSharingConsent: source.infoSharingConsent ?? "notAsked",
    coordinationNeeded: source.coordinationNeeded ?? "notAsked",
    sipConsent: source.sipConsent ?? "notAsked",
    adminComment: source.adminComment ?? "",
    recipients: (source.recipients ?? []).map((r) => ({ ...r })),
  };
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const CoordinationDialog: React.FC<Props> = ({
  open,
  patient,
  availableUnits,
  initialData,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<CoordinationData>(() => makeFreshForm());

  const [recType, setRecType] = useState<RecipientType>("Outpatient care");
  const [recUnit, setRecUnit] = useState<string>("");

  const canAddRecipient = useMemo(() => !!recUnit.trim(), [recUnit]);

  useEffect(() => {
    if (!open) return;

    setForm(makeFreshForm(initialData));
    setRecType("Outpatient care");
    setRecUnit("");
  }, [open, patient?.nationalId, initialData]);

  const setConsent =
    (field: "infoSharingConsent" | "coordinationNeeded" | "sipConsent") =>
    (value: ConsentValue) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, adminComment: e.target.value }));
  };

  const addRecipient = () => {
    const unit = recUnit.trim();
    if (!unit) return;

    setForm((prev) => ({
      ...prev,
      recipients: [...prev.recipients, { type: recType, unit }],
    }));

    setRecUnit("");
  };

  const removeRecipient = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = () => {
    const payload: CoordinationData = {
      ...form,
      adminComment: form.adminComment.trim(),
      recipients: form.recipients.map((r) => ({ ...r })),
    };
    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Coordination (Samordning)</DialogTitle>

      <DialogContent>
        {!patient ? null : (
          <div className="mt-2 space-y-3 text-sm">
            <div className="text-sm">
              <span className="font-semibold">Patient: </span>
              {patient.name} ({patient.nationalId})
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded border border-gray-200 p-3">
                <div className="mb-1 text-xs font-semibold text-gray-700">
                  Consent to information sharing
                </div>
                <RadioGroup
                  row
                  value={form.infoSharingConsent}
                  onChange={(e) =>
                    setConsent("infoSharingConsent")(
                      e.target.value as ConsentValue
                    )
                  }
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  <FormControlLabel value="notAsked" control={<Radio size="small" />} label="Not asked" />
                </RadioGroup>
              </div>

              <div className="rounded border border-gray-200 p-3">
                <div className="mb-1 text-xs font-semibold text-gray-700">
                  Need for coordination (SIP)
                </div>
                <RadioGroup
                  row
                  value={form.coordinationNeeded}
                  onChange={(e) =>
                    setConsent("coordinationNeeded")(
                      e.target.value as ConsentValue
                    )
                  }
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  <FormControlLabel value="notAsked" control={<Radio size="small" />} label="Not asked" />
                </RadioGroup>
              </div>

              <div className="rounded border border-gray-200 p-3 md:col-span-2">
                <div className="mb-1 text-xs font-semibold text-gray-700">
                  Consent to SIP
                </div>
                <RadioGroup
                  row
                  value={form.sipConsent}
                  onChange={(e) =>
                    setConsent("sipConsent")(e.target.value as ConsentValue)
                  }
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                  <FormControlLabel value="notAsked" control={<Radio size="small" />} label="Not asked" />
                </RadioGroup>
              </div>
            </div>

            <TextField
              label="Administrative comment"
              size="small"
              fullWidth
              multiline
              minRows={3}
              value={form.adminComment}
              onChange={handleCommentChange}
            />

            <Divider />

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700">Recipients</div>

              <div className="flex flex-wrap items-end gap-2">
                <TextField
                  label="Recipient type"
                  size="small"
                  select
                  value={recType}
                  onChange={(e) => setRecType(e.target.value as RecipientType)}
                  sx={{ minWidth: 180 }}
                >
                  {RECIPIENT_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Unit / clinic"
                  size="small"
                  select
                  value={recUnit}
                  onChange={(e) => setRecUnit(e.target.value)}
                  sx={{ minWidth: 260 }}
                >
                  <MenuItem value="">(Select)</MenuItem>
                  {availableUnits.map((u) => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={addRecipient}
                  disabled={!canAddRecipient}
                >
                  Add
                </Button>
              </div>

              <div className="rounded border border-gray-200">
                {form.recipients.length === 0 ? (
                  <div className="p-3 text-xs text-gray-500">No recipients added.</div>
                ) : (
                  <table className="min-w-full border-collapse text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b px-2 py-1 text-left">Type</th>
                        <th className="border-b px-2 py-1 text-left">Unit</th>
                        <th className="border-b px-2 py-1 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.recipients.map((r, idx) => (
                        <tr
                          key={`${r.type}-${r.unit}-${idx}`}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="border-b px-2 py-1">{r.type}</td>
                          <td className="border-b px-2 py-1">{r.unit}</td>
                          <td className="border-b px-2 py-1 text-right">
                            <IconButton size="small" onClick={() => removeRecipient(idx)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <p className="text-[11px] text-gray-500">
                This is a simple MVP. Later we can connect it to “Care plan / referrals / external actors”.
              </p>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CoordinationDialog;
