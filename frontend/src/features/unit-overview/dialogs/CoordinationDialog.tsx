// src/features/unit-overview/dialogs/CoordinationDialog.tsx
import { useEffect, useMemo, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@mui/material";

import { useAuth } from "../../../context/AuthContext";
import { useClinics } from "../../../hooks/staff/useClinics";
import { useUnits } from "../../../hooks/staff/useUnits";

import { DEFAULT_COORDINATION_FORM, RECIPIENT_TYPES, } from "../unitOverviewConstants";

import { makeFreshCoordinationForm, normalize } from "../helpers";

import type { ConsentValue, CoordinationData, Inpatient, RecipientType,} from "../types";

/* -----------Types---------------*/
type Props = {
  open: boolean;
  patient: Inpatient | null;
  availableUnits: readonly string[];
  initialData?: CoordinationData;
  onClose: () => void;
  onSave: (data: CoordinationData) => void;
};

type RecipientRow = {
  type: RecipientType;
  unit: string;
  clinicId?: string;
  clinicName?: string;
  unitId?: string;
  unitName?: string;
};

type ConsentField =
  | "infoSharingConsent"
  | "coordinationNeeded"
  | "sipConsent";

/* -----------Component---------------*/
export default function CoordinationDialog({
  open,
  patient,
  initialData,
  onClose,
  onSave,
}: Props) {
  const { user } = useAuth();

  const { data: clinics = [] } = useClinics();
  const { data: ownUnits = [] } = useUnits(user?.clinicId);
  const [form, setForm] = useState<CoordinationData>( DEFAULT_COORDINATION_FORM );

  const [recType, setRecType] =
    useState<RecipientType>("Outpatient care");
  const [recipientClinicId, setRecipientClinicId] = useState("");
  const [recipientUnitId, setRecipientUnitId] = useState("");
  const [otherActor, setOtherActor] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [saveTouched, setSaveTouched] = useState(false);

  const { data: targetUnits = [] } = useUnits(recipientClinicId);

  /* --------- Reset -----------*/
  useEffect(() => {
    if (!open) return;

    setForm(makeFreshCoordinationForm(initialData));
    setRecType("Outpatient care");
    setRecipientClinicId("");
    setRecipientUnitId("");
    setOtherActor("");
    setDuplicateWarning("");
    setSaveTouched(false);
  }, [open, initialData, patient?.id]);

 
  /* --------- Derived -----------*/
  const clinicName =
    clinics.find((c: any) => c.id === user?.clinicId)?.name || "";

  const unitName =
    ownUnits.find((u: any) => u.id === user?.unitId)?.name ||
    user?.unitName ||
    "";

  const clinicOptions = useMemo(
    () =>
      clinics.filter(
        (clinic: any) => clinic.id !== user?.clinicId
      ),
    [clinics, user?.clinicId]
  );

  const unitOptions = useMemo(() => {
    if (recipientClinicId !== user?.clinicId) return targetUnits;

    return targetUnits.filter(
      (unit: any) => unit.id !== user?.unitId
    );
  }, [
    targetUnits,
    recipientClinicId,
    user?.clinicId,
    user?.unitId,
  ]);

  const hasRecipients = form.recipients.length > 0;

  /* --------- Helpers -----------*/
  const updateField = <K extends keyof CoordinationData>(
    key: K,
    value: CoordinationData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const setConsent =
    (field: ConsentField) =>
    (value: ConsentValue) =>
      updateField(field, value);

  const resetRecipientInputs = () => {
    setRecipientClinicId("");
    setRecipientUnitId("");
    setOtherActor("");
  };

  const buildPayload = (
    data: CoordinationData
  ): CoordinationData => ({
    ...data,
    adminComment: data.adminComment.trim(),
    recipients: data.recipients.map((r) => ({ ...r })),
  });

  /* --------- Recipient actions -----------*/
  const addRecipient = (
    clinicId?: string,
    unitId?: string
  ) => {
    setDuplicateWarning("");

    let row: RecipientRow | null = null;

    if (
      recType === "Other actor" ||
      recType === "Municipality"
    ) {
      const text = otherActor.trim();
      if (!text) return;

      row = { type: recType, unit: text };
    } else {
      const clinic = clinics.find(
        (c: any) => c.id === clinicId
      );
      const unit = unitOptions.find(
        (u: any) => u.id === unitId
      );

      if (!clinic || !unit) return;

      row = {
        type: recType,
        unit: unit.name,
        clinicId: clinic.id,
        clinicName: clinic.name,
        unitId: unit.id,
        unitName: unit.name,
      };
    }

    const exists = form.recipients.some(
      (r: any) =>
        normalize(r.type) === normalize(row.type) &&
        normalize(r.unit) === normalize(row.unit)
    );

    if (exists) {
      setDuplicateWarning("Recipient already added.");
      return;
    }

    updateField("recipients", [
      ...form.recipients,
      row as any,
    ]);

    resetRecipientInputs();
  };

  const removeRecipient = (index: number) =>
    updateField(
      "recipients",
      form.recipients.filter((_, i) => i !== index)
    );

  const handleSave = () => {
    setSaveTouched(true);
    onSave(buildPayload(form));
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Coordination (Samordning)</DialogTitle>

      <DialogContent dividers>
        <div className="space-y-4 text-sm">
          {/* Patient */}
          <div className="rounded border border-gray-200 bg-gray-50 px-3 py-2">
            <span className="font-semibold">Patient: </span>
            {patient.name} ({patient.nationalId})
          </div>

          {/* Origin */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <TextField
              label="From clinic"
              size="small"
              value={clinicName}
              fullWidth
               slotProps={{ input: { readOnly: true, },}}
            />

            <TextField
              label="From unit"
              size="small"
              value={unitName}
              fullWidth
               slotProps={{ input: { readOnly: true, },}}
            />

            <TextField
              label="Responsible clinician"
              size="small"
              value={user ? `${user.name} — ${user.role}` : ""}
              fullWidth
              slotProps={{ input: { readOnly: true, },}}
              sx={{ gridColumn: { md: "1 / -1" } }}
            />
          </div>

          {/* Consent */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              [
                "Consent to information sharing",
                "infoSharingConsent",
              ],
              [
                "Need for coordination (SIP)",
                "coordinationNeeded",
              ],
            ].map(([label, field]) => (
              <div
                key={field}
                className="rounded border p-3"
              >
                <div className="mb-2 font-semibold">
                  {label}
                </div>

                <RadioGroup
                  row
                  value={(form as any)[field]}
                  onChange={(e) =>
                    setConsent(field as ConsentField)(
                      e.target.value as ConsentValue
                    )
                  }
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                  />
                  <FormControlLabel
                    value="notAsked"
                    control={<Radio />}
                    label="Not asked"
                  />
                </RadioGroup>
              </div>
            ))}

            <div className="rounded border p-3 md:col-span-2">
              <div className="mb-2 font-semibold">
                Consent to SIP
              </div>

              <RadioGroup
                row
                value={form.sipConsent}
                onChange={(e) =>
                  setConsent("sipConsent")(
                    e.target.value as ConsentValue
                  )
                }
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No"
                />
                <FormControlLabel
                  value="notAsked"
                  control={<Radio />}
                  label="Not asked"
                />
              </RadioGroup>
            </div>
          </div>

          {/* Comment */}
          <TextField
            label="Administrative comment"
            size="small"
            multiline
            minRows={4}
            fullWidth
            value={form.adminComment}
            onChange={(e) =>
              updateField(
                "adminComment",
                e.target.value
              )
            }
          />

          {/* Recipients */}
          <div className="space-y-2 rounded border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                Recipients
              </div>

              {hasRecipients && (
                <Chip
                  size="small"
                  color="primary"
                  label={`${form.recipients.length} added`}
                />
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {/* Type */}
              <TextField
                label="Recipient type"
                size="small"
                select
                fullWidth
                value={recType}
                onChange={(e) => {
                  setRecType(
                    e.target.value as RecipientType
                  );
                  resetRecipientInputs();
                }}
              >
                {RECIPIENT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              {/* Text mode */}
              {recType === "Other actor" ||
              recType === "Municipality" ? (
                <>
                  <TextField
                    label={
                      recType === "Municipality"
                        ? "Municipality / service"
                        : "Actor name"
                    }
                    size="small"
                    fullWidth
                    value={otherActor}
                    onChange={(e) =>
                      setOtherActor(e.target.value)
                    }
                    onBlur={() => addRecipient()}
                  />
                  <div />
                </>
              ) : (
                <>
                  <TextField
                    label="Clinic"
                    size="small"
                    select
                    fullWidth
                    value={recipientClinicId}
                    onChange={(e) => {
                      setRecipientClinicId(
                        e.target.value
                      );
                      setRecipientUnitId("");
                    }}
                  >
                    <MenuItem value="">
                      (Select)
                    </MenuItem>

                    {clinicOptions.map((clinic: any) => (
                      <MenuItem
                        key={clinic.id}
                        value={clinic.id}
                      >
                        {clinic.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Unit"
                    size="small"
                    select
                    fullWidth
                    disabled={!recipientClinicId}
                    value={recipientUnitId}
                    onChange={(e) => {
                      const unitId = e.target.value;
                      setRecipientUnitId(unitId);
                      addRecipient(
                        recipientClinicId,
                        unitId
                      );
                    }}
                  >
                    <MenuItem value="">
                      (Select)
                    </MenuItem>

                    {unitOptions.map((unit: any) => (
                      <MenuItem
                        key={unit.id}
                        value={unit.id}
                      >
                        {unit.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            </div>

            {duplicateWarning && (
              <Alert severity="warning">
                {duplicateWarning}
              </Alert>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded border border-gray-200">
              {!hasRecipients ? (
                <div className="p-3 text-xs text-gray-500">
                  No recipients added.
                </div>
              ) : (
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">
                        Type
                      </th>
                      <th className="px-3 py-2 text-left">
                        Recipient
                      </th>
                      <th className="px-3 py-2 text-left">
                        Details
                      </th>
                      <th className="px-3 py-2 text-right">
                        Remove
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {form.recipients.map(
                      (row: any, index) => (
                        <tr
                          key={`${row.type}-${row.unit}-${index}`}
                        >
                          <td className="border-t px-3 py-2">
                            {row.type}
                          </td>

                          <td className="border-t px-3 py-2">
                            {row.unit}
                          </td>

                          <td className="border-t px-3 py-2 text-gray-600">
                            {row.clinicName || "—"}
                          </td>

                          <td className="border-t px-3 py-2 text-right">
                            <Tooltip title="Remove">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeRecipient(
                                    index
                                  )
                                }
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {saveTouched && !hasRecipients && (
            <Alert severity="info">
              You can save without recipients if only
              documentation is needed.
            </Alert>
          )}
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}