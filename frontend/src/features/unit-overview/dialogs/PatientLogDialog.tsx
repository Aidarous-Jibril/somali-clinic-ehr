// src/features/unit-overview/dialogs/PatientLogDialog.tsx
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { Inpatient, PatientLogEntry } from "../types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type PatientLogDialogProps = {
  open: boolean;
  patient: Inpatient | null;
  entries: PatientLogEntry[];
  onClose: () => void;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const PatientLogDialog: React.FC<PatientLogDialogProps> = ({
  open,
  patient,
  entries,
  onClose,
}) => {
  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const hasEntries = entries.length > 0;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Patient log</DialogTitle>

      <DialogContent>
        {!patient ? null : (
          <div className="mt-2 space-y-2 text-sm">
            {/* Patient header */}
            <div>
              <span className="font-semibold">Patient: </span>
              {patient.name} ({patient.nationalId})
            </div>

            {/* Table */}
            <div className="mt-2 max-h-72 overflow-auto rounded border border-gray-300">
              <table className="min-w-full border-collapse text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-40 border border-gray-200 px-2 py-1 text-left">
                      Date / time
                    </th>
                    <th className="w-56 border border-gray-200 px-2 py-1 text-left">
                      Category
                    </th>
                    <th className="border border-gray-200 px-2 py-1 text-left">
                      Information
                    </th>
                    <th className="w-24 border border-gray-200 px-2 py-1 text-left">
                      By
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!hasEntries ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="border border-gray-200 px-2 py-3 text-center text-gray-500"
                      >
                        No log entries for this care contact.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, idx) => (
                      <tr
                        key={`${entry.dateTime}-${entry.category}-${idx}`}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border border-gray-200 px-2 py-1">
                          {entry.dateTime}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {entry.category}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {entry.text}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {entry.author || ""}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer note */}
            <p className="mt-1 text-[11px] text-gray-500">
              The patient log gives an overview of activities during this care
              contact. Information is read-only in this view.
            </p>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientLogDialog;
