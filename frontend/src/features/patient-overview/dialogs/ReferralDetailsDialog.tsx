import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import type { Referral, ReferralStatus } from "../../../features/patient-overview/types";

type Props = {
  referral: Referral | null;
  onClose: () => void;

  onUpdateStatus?: (id: string, status: ReferralStatus) => void;
};

const STATUSES: ReferralStatus[] = ["Unassessed", "Accepted", "In progress", "Completed"];

export const ReferralDetailsDialog: React.FC<Props> = ({ referral, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState<ReferralStatus>("Unassessed");

  useEffect(() => {
    if (referral) setStatus(referral.status);
  }, [referral]);

  const canSave = referral && status !== referral.status;

  return (
    <Dialog open={Boolean(referral)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Referral details</DialogTitle>

      <DialogContent>
        {referral && (
          <div className="space-y-2 text-sm">
            <div><b>To:</b> {referral.to}</div>
            <div><b>From:</b> {referral.from}</div>

            {/* ✅ NEW */}
            <div><b>Sent by:</b> {referral.sentByName} ({referral.sentByRole})</div>
            {referral.sentByUnit && <div><b>Sender unit:</b> {referral.sentByUnit}</div>}

            <div className="pt-2">
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Status"
                  size="small"
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReferralStatus)}
                  fullWidth
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField label="Date" size="small" value={referral.date} fullWidth disabled />
              </Stack>
            </div>

            {referral.urgent && (
              <div>
                <b>Urgency:</b> Acute
              </div>
            )}

            <div className="pt-2 text-[13px] text-gray-700">{referral.details}</div>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        {/* ✅ NEW */}
        <Button
          variant="contained"
          disabled={!referral || !onUpdateStatus || !canSave}
          onClick={() => {
            if (!referral || !onUpdateStatus) return;
            onUpdateStatus(referral.id, status);
            onClose();
          }}
        >
          Save status
        </Button>
      </DialogActions>
    </Dialog>
  );
};
