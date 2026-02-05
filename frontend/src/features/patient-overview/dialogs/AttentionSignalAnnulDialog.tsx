// src/components/patient-overview/dialogs/AttentionSignalAnnulDialog.tsx
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export const AttentionSignalAnnulDialog: React.FC<Props> = ({ open, title, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Makulera registrering</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div className="text-sm text-gray-700">
            Vill du makulera: <span className="font-semibold">{title ?? ""}</span>?
          </div>
          <TextField
            label="Orsak (valfritt)"
            size="small"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="t.ex. felregistrerad"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Avbryt</Button>
        <Button color="error" variant="contained" onClick={handleConfirm}>
          Makulera
        </Button>
      </DialogActions>
    </Dialog>
  );
};
