// src/features/unit-overview/dialogs/ChangeBedDialog.tsx
import React, { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import type { BedChangeOption, Inpatient } from "../types";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Props = {
  open: boolean;
  patient: Inpatient | null;
  beds: BedChangeOption[];

  onClose: () => void;
  onChangeBed: (bedId: string | null) => void;
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const ChangeBedDialog: React.FC<Props> = ({
  open,
  patient,
  beds,
  onClose,
  onChangeBed,
}) => {
  // ---------------------------------------------------------------------------
  // Derived helpers
  // ---------------------------------------------------------------------------

  const bedRows = useMemo(() => {
    if (!patient) return [];

    return beds.map((bed) => {
      const isCurrent = bed.id === patient.bed;
      const isOccupiedByOther = bed.status === "occupied" && !isCurrent;

      const secondary = isCurrent ? "Current bed" : isOccupiedByOther ? "Occupied" : "Free";
      const disabled = isOccupiedByOther;

      return { bed, disabled, secondary };
    });
  }, [beds, patient]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSelect = (bedId: string) => {
    if (!patient) return;
    onChangeBed(bedId);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Change bed</DialogTitle>

      <DialogContent>
        {patient && (
          <div className="mt-2 space-y-2 text-sm">
            {/* Patient summary */}
            <div>
              <span className="font-semibold">Patient: </span>
              {patient.name} ({patient.nationalId})
            </div>

            <div>
              <span className="font-semibold">Current bed: </span>
              {patient.bed}
            </div>

            <div>
              <span className="font-semibold">Ward: </span>
              {patient.ward}
            </div>

            <p className="mt-2 text-[11px] text-gray-500">
              Move the patient to another bed on this ward. Occupied beds are disabled.
            </p>

            {/* Bed list */}
            <div className="mt-2 max-h-64 overflow-auto rounded border border-gray-300">
              <List dense disablePadding>
                {bedRows.map(({ bed, disabled, secondary }) => (
                  <div key={bed.id}>
                    <ListItemButton
                      disabled={disabled}
                      onClick={() => !disabled && handleSelect(bed.id)}
                    >
                      <ListItemText primary={bed.label} secondary={secondary} />
                    </ListItemButton>
                    <Divider />
                  </div>
                ))}
              </List>
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

export default ChangeBedDialog;
