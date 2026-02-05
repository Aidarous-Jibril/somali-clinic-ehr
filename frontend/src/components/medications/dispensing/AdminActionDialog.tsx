// src/components/medications/dispensing/AdminActionDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import type { DoseRef, Medication } from "../../../features/medications/types";

export function AdminActionDialog({
  open,
  onClose,
  onSave,

  adminKind,
  selectedDoses,
  primarySelected,
  selectedMed,

  includedKeys,
  setIncludedKeys,

  adminDoseByKey,
  setAdminDoseByKey,

  adminTime,
  setAdminTime,

  adminComment,
  setAdminComment,

  adminReason,
  setAdminReason,

  formError,
  setFormError,

  SignedByBlock,

  getMed,
  doseRefKey,
  isDirective,
  isDoseRequiringAdminDose,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;

  adminKind: "administer" | "selfAdmin" | "skip";
  selectedDoses: DoseRef[];
  primarySelected: DoseRef | null;
  selectedMed: Medication | null;

  includedKeys: Record<string, boolean>;
  setIncludedKeys: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  adminDoseByKey: Record<string, string>;
  setAdminDoseByKey: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  adminTime: string;
  setAdminTime: React.Dispatch<React.SetStateAction<string>>;

  adminComment: string;
  setAdminComment: React.Dispatch<React.SetStateAction<string>>;

  adminReason: string;
  setAdminReason: React.Dispatch<React.SetStateAction<string>>;

  formError: string | null;
  setFormError: React.Dispatch<React.SetStateAction<string | null>>;

  SignedByBlock: React.ReactNode;

  getMed: (medId: string) => Medication | null;
  doseRefKey: (d: DoseRef) => string;
  isDirective: (m?: Medication | null) => boolean;
  isDoseRequiringAdminDose: (m: Medication | null) => boolean;
}) {
  const count = selectedDoses.length;
  const primaryKey = primarySelected ? doseRefKey(primarySelected) : "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {adminKind === "skip"
          ? "Skip dose"
          : adminKind === "selfAdmin"
          ? "Self-administer"
          : "Administer"}
        {count > 1 ? ` (${count})` : ""}
      </DialogTitle>

      <DialogContent dividers>
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          {/* left pane */}
          <div className="rounded border border-gray-200 bg-white">
            <div className="border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
              {count > 1 ? "Selected doses" : "Ordered medication"}
            </div>

            <div className="p-3 text-xs text-gray-800 space-y-2">
              {count <= 1 ? (
                <>
                  <div className="font-semibold">
                    {selectedMed ? selectedMed.name : "—"}
                    {selectedMed?.strength ? (
                      <span className="font-normal text-gray-600">
                        {" "}
                        • {selectedMed.strength}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-gray-700">
                    {selectedMed?.dosingText ?? ""}
                  </div>

                  <div className="rounded border border-gray-200 bg-gray-50 p-2">
                    <div className="text-[11px] text-gray-600">Dose</div>
                    <div className="font-semibold">
                      {primarySelected?.item?.date} {primarySelected?.item?.time}
                    </div>
                    <div className="text-gray-700">
                      {primarySelected?.item?.label ?? ""}
                    </div>
                  </div>

                  {isDirective(selectedMed) ? (
                    <div className="text-[11px] text-gray-600">
                      This is a{" "}
                      <span className="font-semibold">General directive</span>{" "}
                      dose (mock).
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="max-h-[340px] overflow-auto space-y-2">
                  {selectedDoses.map((d) => {
                    const k = doseRefKey(d);
                    const med = getMed(d.medId);
                    const name = med
                      ? `${med.name}${med.strength ? ` • ${med.strength}` : ""}`
                      : d.medId;

                    return (
                      <label
                        key={k}
                        className="flex items-start gap-2 rounded border border-gray-200 bg-gray-50 p-2"
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5"
                          checked={includedKeys[k] !== false}
                          onChange={(e) =>
                            setIncludedKeys((prev) => ({
                              ...prev,
                              [k]: e.target.checked,
                            }))
                          }
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {name}
                          </div>
                          <div className="text-gray-700">
                            {d.item.date} {d.item.time} — {d.item.label}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* right form */}
          <div>
            {adminKind === "skip" ? (
              <>
                {count <= 1 ? (
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      label="Time"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      value={adminTime}
                      onChange={(e) => setAdminTime(e.target.value)}
                      size="small"
                    />

                    <TextField
                      label="Medication"
                      size="small"
                      value={selectedMed?.name ?? primarySelected?.medId ?? ""}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />

                    <TextField
                      label="Reason"
                      size="small"
                      value={adminReason}
                      onChange={(e) => {
                        setAdminReason(e.target.value);
                        setFormError(null);
                      }}
                      multiline
                      minRows={3}
                      error={!!formError}
                      helperText={formError ?? "Why was the dose skipped? (mock)"}
                      className="col-span-2"
                    />

                    <TextField
                      label="Comment (optional)"
                      size="small"
                      value={adminComment}
                      onChange={(e) => {
                        setAdminComment(e.target.value);
                        setFormError(null);
                      }}
                      multiline
                      minRows={3}
                      className="col-span-2"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <TextField
                      label="Reason (applies to selected)"
                      size="small"
                      value={adminReason}
                      onChange={(e) => {
                        setAdminReason(e.target.value);
                        setFormError(null);
                      }}
                      multiline
                      minRows={3}
                      error={!!formError}
                      helperText={
                        formError ?? "Why were these doses skipped? (mock)"
                      }
                      fullWidth
                    />

                    <TextField
                      label="Comment (optional, applies to selected)"
                      size="small"
                      value={adminComment}
                      onChange={(e) => {
                        setAdminComment(e.target.value);
                        setFormError(null);
                      }}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </div>
                )}

                {SignedByBlock}
              </>
            ) : (
              <>
                {count <= 1 ? (
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      label="Time"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      value={adminTime}
                      onChange={(e) => setAdminTime(e.target.value)}
                      size="small"
                    />

                    <TextField
                      label="Medication"
                      size="small"
                      value={selectedMed?.name ?? primarySelected?.medId ?? ""}
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />

                    <TextField
                      label="Administered dose"
                      size="small"
                      value={adminDoseByKey[primaryKey] ?? ""}
                      onChange={(e) => {
                        setAdminDoseByKey((prev) => ({
                          ...prev,
                          [primaryKey]: e.target.value,
                        }));
                        setFormError(null);
                      }}
                      error={!!formError}
                      helperText={
                        formError ??
                        "For PRN/directives/injections: enter volume/dose (mock)."
                      }
                    />

                    <TextField label="Batch number" size="small" />

                    <TextField
                      label="Comment"
                      size="small"
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      multiline
                      minRows={3}
                    />

                    <TextField
                      label="Reason (if deviating)"
                      size="small"
                      value={adminReason}
                      onChange={(e) => setAdminReason(e.target.value)}
                      multiline
                      minRows={3}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded border border-gray-200 bg-white p-2">
                      <div className="text-sm font-medium text-gray-900">
                        Administered dose (per selected dose)
                      </div>

                      <div className="mt-2 max-h-[240px] overflow-auto space-y-2">
                        {selectedDoses
                          .filter((d) => includedKeys[doseRefKey(d)] !== false)
                          .map((d) => {
                            const k = doseRefKey(d);
                            const med = getMed(d.medId);
                            const needsDose = isDoseRequiringAdminDose(med);

                            return (
                              <div
                                key={k}
                                className="grid gap-2 rounded border border-gray-200 bg-gray-50 p-2 md:grid-cols-[1fr_160px]"
                              >
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-gray-900 truncate">
                                    {med ? med.name : d.medId}
                                    {med?.strength ? (
                                      <span className="font-normal text-gray-600">
                                        {" "}
                                        • {med.strength}
                                      </span>
                                    ) : null}
                                  </div>

                                  <div className="text-xs text-gray-700">
                                    {d.item.date} {d.item.time} — planned:{" "}
                                    <span className="font-medium">
                                      {d.item.label}
                                    </span>
                                  </div>

                                  {needsDose ? (
                                    <div className="text-[11px] text-gray-500">
                                      Requires dose entry
                                      (PRN/directive/injection).
                                    </div>
                                  ) : null}
                                </div>

                                <TextField
                                  label="Administered dose"
                                  size="small"
                                  value={adminDoseByKey[k] ?? ""}
                                  onChange={(e) => {
                                    setAdminDoseByKey((prev) => ({
                                      ...prev,
                                      [k]: e.target.value,
                                    }));
                                    setFormError(null);
                                  }}
                                  error={
                                    !!formError &&
                                    needsDose &&
                                    !(adminDoseByKey[k] ?? "").trim()
                                  }
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <TextField
                      label="Comment (applies to selected)"
                      size="small"
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      multiline
                      minRows={3}
                      fullWidth
                    />

                    <TextField
                      label="Reason (if deviating, applies to selected)"
                      size="small"
                      value={adminReason}
                      onChange={(e) => setAdminReason(e.target.value)}
                      multiline
                      minRows={3}
                      fullWidth
                    />

                    {formError ? (
                      <div className="text-sm text-red-600">{formError}</div>
                    ) : null}
                  </div>
                )}

                {SignedByBlock}
              </>
            )}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!selectedDoses.length}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
