// src/features/messenger/dialogs/ComposeMessageDialog.tsx
import React from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { MessengerComposeDraft, MessengerMessageType } from "../types";

type Props = {
  open: boolean;
  draft: MessengerComposeDraft | null;
  setDraft: (next: MessengerComposeDraft | null) => void;

  onClose: () => void;
  onSaveDraft: () => void;
  onSend: () => void;
};

export const ComposeMessageDialog: React.FC<Props> = ({
  open,
  draft,
  setDraft,
  onClose,
  onSaveDraft,
  onSend,
}) => {
  const safe = draft ?? {
    mode: "new" as const,
    type: "non_patient_related" as MessengerMessageType,
    category: "General information",
    to: "",
    subject: "",
    body: "",
    scheduleLater: false,
    scheduledFor: "",
  };

  const patch = (p: Partial<MessengerComposeDraft>) => setDraft({ ...safe, ...p });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {safe.mode === "new"
          ? "New message"
          : safe.mode === "forward"
          ? "Forward message"
          : "Reply"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Type"
              size="small"
              select
              fullWidth
              value={safe.type}
              onChange={(e) => patch({ type: e.target.value as MessengerMessageType })}
            >
              <MenuItem value="patient_related">Patient related</MenuItem>
              <MenuItem value="non_patient_related">Non-patient related</MenuItem>
            </TextField>

            <TextField
              label="Category"
              size="small"
              fullWidth
              value={safe.category}
              onChange={(e) => patch({ category: e.target.value })}
              placeholder="e.g. For information"
            />
          </Stack>

          <TextField
            label="To"
            size="small"
            fullWidth
            value={safe.to}
            onChange={(e) => patch({ to: e.target.value })}
            placeholder="Recipient name / unit"
          />

          <TextField
            label="Subject"
            size="small"
            fullWidth
            value={safe.subject}
            onChange={(e) => patch({ subject: e.target.value })}
          />

          <TextField
            label="Message"
            size="small"
            fullWidth
            multiline
            minRows={8}
            value={safe.body}
            onChange={(e) => patch({ body: e.target.value })}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(safe.scheduleLater)}
                  onChange={(e) => patch({ scheduleLater: e.target.checked })}
                />
              }
              label="Schedule later (Outgoing)"
            />

            <TextField
              label="Scheduled for"
              size="small"
              value={safe.scheduledFor ?? ""}
              onChange={(e) => patch({ scheduledFor: e.target.value })}
              disabled={!safe.scheduleLater}
              placeholder="YYYY-MM-DD HH:mm"
              fullWidth
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSaveDraft}>Save draft</Button>
        <Button variant="contained" onClick={onSend}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
