// src/features/unit-overview/dialogs/EwsLogDialog.tsx
import React, { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { Inpatient, EwsEntry } from "../types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type EwsLogDialogProps = {
  open: boolean;
  patient: Inpatient | null;
  entries: EwsEntry[];
  onClose: () => void;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const EwsLogDialog: React.FC<EwsLogDialogProps> = ({
  open,
  patient,
  entries,
  onClose,
}) => {
  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const hasEntries = entries.length > 0;

  const sortedEntries = useMemo(() => {
    // dateTime is already "YYYY-MM-DD HH:mm" so string sort works for chronological order
    return [...entries].sort((a, b) => b.dateTime.localeCompare(a.dateTime)); // newest first
  }, [entries]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>EWS log</DialogTitle>

      <DialogContent>
        {!patient ? null : (
          <div className="mt-2 space-y-2 text-sm">
            {/* Patient header */}
            <div>
              <span className="font-semibold">Patient: </span>
              {patient.name} ({patient.nationalId})
            </div>

            {/* Log table */}
            <div className="mt-2 max-h-64 overflow-auto rounded border border-gray-200 bg-gray-50">
              <table className="min-w-full border-collapse text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 px-2 py-1 text-left">
                      Date / time
                    </th>
                    <th className="border border-gray-200 px-2 py-1 text-left">
                      Score
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!hasEntries ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="border border-gray-200 px-2 py-2 text-center text-gray-500"
                      >
                        No EWS values registered yet.
                      </td>
                    </tr>
                  ) : (
                    sortedEntries.map((entry, idx) => (
                      <tr
                        key={`${entry.dateTime}-${idx}`}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border border-gray-200 px-2 py-1">
                          {entry.dateTime}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {entry.score}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EwsLogDialog;
