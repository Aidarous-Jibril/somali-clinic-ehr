// src/components/medications/dispensing/HandoverDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import type { Medication, DoseRef } from "../../../features/medications/types";

type HandoverPerson = { id: string; name: string };

export function HandoverDialog({
  open,
  onClose,
  onSave,

  selectedDoses,
  primarySelected,
  selectedMed,

  handoverFrom,
  setHandoverFrom,
  handoverTo,
  setHandoverTo,

  onUpdateRange,

  handoverVisibleDoses,
  handoverIncludedKeys,
  setHandoverIncludedKeys,

  handoverToId,
  setHandoverToId,
  handoverPeople,

  handoverNote,
  setHandoverNote,

  SignedByBlock,

  getMed,
  doseRefKey,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;

  selectedDoses: DoseRef[];
  primarySelected: DoseRef | null;
  selectedMed: Medication | null;

  handoverFrom: string;
  setHandoverFrom: React.Dispatch<React.SetStateAction<string>>;
  handoverTo: string;
  setHandoverTo: React.Dispatch<React.SetStateAction<string>>;

  onUpdateRange: (from: string, to: string) => void;

  handoverVisibleDoses: DoseRef[];
  handoverIncludedKeys: Record<string, boolean>;
  setHandoverIncludedKeys: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;

  handoverToId: string;
  setHandoverToId: React.Dispatch<React.SetStateAction<string>>;
  handoverPeople: HandoverPerson[];

  handoverNote: string;
  setHandoverNote: React.Dispatch<React.SetStateAction<string>>;

  SignedByBlock: React.ReactNode;

  getMed: (medId: string) => Medication | null;
  doseRefKey: (d: DoseRef) => string;
}) {
  const count = selectedDoses.length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Handover (Överlämna)
        {count > 1 ? ` (${count})` : ""}
      </DialogTitle>

      <DialogContent dividers>
        {/* TOP: time range + update */}
        <div className="mb-4 flex flex-wrap items-end gap-2">
          <TextField
            label="From"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={handoverFrom}
            onChange={(e) => setHandoverFrom(e.target.value)}
            size="small"
          />
          <TextField
            label="To"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={handoverTo}
            onChange={(e) => setHandoverTo(e.target.value)}
            size="small"
          />
          <Button
            variant="outlined"
            onClick={() => onUpdateRange(handoverFrom, handoverTo)}
            size="small"
          >
            Update
          </Button>
          <div className="text-xs text-gray-500">
            Shows only doses within the selected time range.
          </div>
        </div>

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
                </>
              ) : (
                <>
                  <div className="text-[11px] text-gray-500">
                    Showing: {handoverVisibleDoses.length} of {count}
                  </div>

                  <div className="max-h-[340px] overflow-auto space-y-2">
                    {handoverVisibleDoses.length === 0 ? (
                      <div className="rounded border border-gray-200 bg-gray-50 p-2 text-gray-600">
                        No selected doses are within this time range. Adjust
                        From/To and click Update.
                      </div>
                    ) : (
                      handoverVisibleDoses.map((d) => {
                        const k = doseRefKey(d);
                        const med = getMed(d.medId);
                        const name = med
                          ? `${med.name}${
                              med.strength ? ` • ${med.strength}` : ""
                            }`
                          : d.medId;

                        return (
                          <label
                            key={k}
                            className="flex items-start gap-2 rounded border border-gray-200 bg-gray-50 p-2"
                          >
                            <input
                              type="checkbox"
                              className="mt-0.5"
                              checked={handoverIncludedKeys[k] !== false}
                              onChange={(e) =>
                                setHandoverIncludedKeys((prev) => ({
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
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* right form */}
          <div>
            <div className="grid grid-cols-1 gap-3">
              <FormControl size="small" fullWidth>
                <InputLabel id="handover-to-label">Handover to</InputLabel>
                <Select
                  labelId="handover-to-label"
                  label="Handover to"
                  value={handoverToId}
                  onChange={(e) => setHandoverToId(String(e.target.value))}
                >
                  {handoverPeople.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Message / note"
                size="small"
                value={handoverNote}
                onChange={(e) => setHandoverNote(e.target.value)}
                multiline
                minRows={6}
                helperText="Keep it short: what to follow up, what to monitor, etc. (mock)"
              />

              {SignedByBlock}
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!selectedDoses.length || handoverVisibleDoses.length === 0}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
