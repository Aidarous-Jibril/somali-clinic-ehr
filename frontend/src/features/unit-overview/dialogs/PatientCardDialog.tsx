// src/features/unit-overview/dialogs/PatientCardDialog.tsx
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { Inpatient } from "../types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type PatientCardDialogProps = {
  open: boolean;
  patient: Inpatient | null;
  onClose: () => void;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const PatientCardDialog: React.FC<PatientCardDialogProps> = ({
  open,
  patient,
  onClose,
}) => {
  // ---------------------------------------------------------------------------
  // Derived values (safe fallbacks)
  // ---------------------------------------------------------------------------

  const ewsLabel = patient?.ews ?? "-";

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Patient card</DialogTitle>

      <DialogContent>
        {!patient ? null : (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Name: </span>
              {patient.name}
            </div>

            <div>
              <span className="font-semibold">National ID: </span>
              {patient.nationalId}
            </div>

            <div>
              <span className="font-semibold">Ward: </span>
              {patient.ward}
            </div>

            <div>
              <span className="font-semibold">Team: </span>
              {patient.team}
            </div>

            <div>
              <span className="font-semibold">Start date: </span>
              {patient.startDate}
            </div>

            <div>
              <span className="font-semibold">EWS: </span>
              {ewsLabel}
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

export default PatientCardDialog;
