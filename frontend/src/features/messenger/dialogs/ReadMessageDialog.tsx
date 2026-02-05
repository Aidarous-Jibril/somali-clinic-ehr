// src/features/messenger/dialogs/ReadMessageDialog.tsx
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import type { MessengerMessage } from "../types";

type Props = {
  open: boolean;
  message: MessengerMessage | null;
  onClose: () => void;

  onReply: () => void;
  onReplyAll: () => void;
  onForward: () => void;
  onDelete: () => void;
};

export const ReadMessageDialog: React.FC<Props> = ({
  open,
  message,
  onClose,
  onReply,
  onReplyAll,
  onForward,
  onDelete,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Message</DialogTitle>

      <DialogContent>
        {!message ? (
          <div className="text-sm text-gray-600">No message selected.</div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="grid gap-2 md:grid-cols-2">
              <div><span className="font-semibold">Subject:</span> {message.subject}</div>
              <div><span className="font-semibold">Date:</span> {message.receivedAt}</div>
              <div><span className="font-semibold">From:</span> {message.from}</div>
              <div><span className="font-semibold">To:</span> {message.to}</div>
              <div><span className="font-semibold">Category:</span> {message.category}</div>
              <div><span className="font-semibold">Type:</span> {message.type === "patient_related" ? "Patient related" : "Non-patient related"}</div>
              {message.patientId && (
                <div className="md:col-span-2">
                  <span className="font-semibold">Patient:</span> {message.patientName ?? "-"} ({message.patientId})
                </div>
              )}
            </div>

            <div className="mt-3 whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-3 text-[13px] text-gray-800">
              {message.body}
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onDelete}>Delete</Button>
        <div className="flex-1" />
        <Button onClick={onForward}>Forward</Button>
        <Button onClick={onReplyAll}>Reply all</Button>
        <Button variant="contained" onClick={onReply}>
          Reply
        </Button>
      </DialogActions>
    </Dialog>
  );
};
