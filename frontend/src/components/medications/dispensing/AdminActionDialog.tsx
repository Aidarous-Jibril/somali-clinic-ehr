// src/components/medications/AdminActionDialog.tsx
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

type Props = {
  open: boolean;
  mode: "administer" | "selfAdmin" | "skip";
  dose?: string;
  onClose: () => void;
  onSave: (data: { dose: string; comment: string; }) => void;
};

export function AdminActionDialog({ open, mode, dose: initialDose = "", onClose, onSave, }: Props) {
  const [dose, setDose] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) {
      setDose(initialDose);
      setComment("");
    }
  }, [open, initialDose]);

  const title = mode === "skip" ? "Skip Dose" : mode === "selfAdmin" ? "Self-administer": "Administer";

  const requiresDose = mode !== "skip";

  const handleSave = () => {
    onSave({
      dose,
      comment,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <div className="space-y-4 pt-1">
          {requiresDose && (
            <TextField
              label="Administered dose"
              value={dose}
              onChange={(e) =>
                setDose(e.target.value)
              }
              size="small"
              fullWidth
              margin="normal"
            />
          )}

          <TextField
            label={
              mode === "skip"
                ? "Reason / Comment"
                : "Comment"
            }
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            size="small"
            multiline
            minRows={3}
            fullWidth
            margin="normal"
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            requiresDose &&
            !dose.trim()
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}