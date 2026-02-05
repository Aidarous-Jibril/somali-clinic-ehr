// src/features/unit-overview/dialogs/ReserveBedDialog.tsx
import React, { useMemo } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

import type { BedOption } from "../types";

type ReserveBedDialogProps = {
  open: boolean;
  beds: BedOption[];
  onClose: () => void;
  onReserve: (bedId: string | null) => void;
};

// -----------------------------------------------------------------------------
// Constants + helpers
// -----------------------------------------------------------------------------

const STATUS_COLOR: Record<BedOption["status"], string> = {
  free: "#16a34a",
  reserved: "#2563eb",
  occupied: "#b91c1c",
};

const STATUS_LABEL: Record<BedOption["status"], string> = {
  free: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
};

const isSelectable = (b: BedOption) => b.status === "free";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const ReserveBedDialog: React.FC<ReserveBedDialogProps> = ({
  open,
  beds,
  onClose,
  onReserve,
}) => {
  // Optional: keep list stable + predictable (free first)
  const sortedBeds = useMemo(() => {
    const rank: Record<BedOption["status"], number> = { free: 0, reserved: 1, occupied: 2 };
    return [...beds].sort((a, b) => rank[a.status] - rank[b.status] || a.label.localeCompare(b.label));
  }, [beds]);

  const handleSelect = (bed: BedOption) => {
    if (!isSelectable(bed)) return;
    onReserve(bed.id);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Reserve bed</DialogTitle>

      <DialogContent>
        <div className="mb-2 text-xs text-gray-600">
          Select an available bed for the planned transfer.
        </div>

        <div className="space-y-1">
          {sortedBeds.map((b) => (
            <Button
              key={b.id}
              fullWidth
              size="small"
              variant={isSelectable(b) ? "outlined" : "text"}
              disabled={!isSelectable(b)}
              onClick={() => handleSelect(b)}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              {b.label} —{" "}
              <span style={{ color: STATUS_COLOR[b.status] }}>
                {STATUS_LABEL[b.status]}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onReserve(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReserveBedDialog;
