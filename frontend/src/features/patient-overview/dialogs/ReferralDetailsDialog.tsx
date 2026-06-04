// src/features/patient-overview/dialogs/ReferralDetailsDialog.tsx

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import type { Referral, ReferralStatus, } from "../../../features/patient-overview/types";

import { useAuth } from "../../../context/AuthContext";
import { useUnits } from "../../../hooks/staff/useUnits";
import { formatDateTime } from "../../../utils/dateFormat";

import { parseReferralDetails, prettifyReferralType, yesNo, } from "../../../features/patient-overview/helpers";

type Props = {
  referral: Referral | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: ReferralStatus) => void;
};

const STATUSES: ReferralStatus[] = [ "Unassessed", "Accepted", "In progress", "Completed",];

const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode; }) => (
  <div>
    <div className="text-xs text-gray-500">{label}</div>
    <div className="font-medium text-gray-900">{value || "-"}</div>
  </div>
);

export const ReferralDetailsDialog = ({ referral, onClose, onUpdateStatus, }: Props) => {
  const { unitId, user } = useAuth();
  const { data: units = [] } = useUnits(user?.clinicId);

  const [status, setStatus] =
    useState<ReferralStatus>("Unassessed");

  useEffect(() => {
    if (referral) setStatus(referral.status);
  }, [referral]);

  const details = useMemo(
    () => parseReferralDetails(referral?.details),
    [referral?.details]
  );

  const senderUnitName =
    units.find((u: any) => u.id === referral?.sentByUnit)
      ?.name || referral?.sentByUnit;

  const canEditStatus =
    !!referral && referral.toUnitId === unitId;

  const canSave = !!referral && !!onUpdateStatus && canEditStatus && status !== referral.status;

  if (!referral) return null;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Referral details</DialogTitle>

      <DialogContent dividers>
        <div className="space-y-5 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow
              label="Destination"
              value={referral.to}
            />
            <InfoRow
              label="Sent from"
              value={referral.from}
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-1 text-xs text-gray-500">
              Responsible clinician
            </div>

            <div className="font-medium">
              {referral.sentByName} ({referral.sentByRole})
            </div>

            {referral.sentByUnit && (
              <div className="mt-1 text-xs text-gray-600">
                Unit: {senderUnitName}
              </div>
            )}
          </div>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              label="Status"
              select
              size="small"
              fullWidth
              value={status}
              disabled={!canEditStatus}
              onChange={(e) =>
                setStatus(
                  e.target.value as ReferralStatus
                )
              }
            >
              {STATUSES.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date"
              size="small"
              fullWidth
              disabled
              value={formatDateTime(referral.date)}
            />
          </Stack>

          {referral.urgent && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 font-medium text-red-700">
              Urgent referral
            </div>
          )}

          {details ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-3 font-semibold text-blue-900">
                Transfer details
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow
                  label="Type"
                  value={prettifyReferralType(
                    details.type
                  )}
                />

                <InfoRow
                  label="Planned time"
                  value={formatDateTime(
                    details.plannedAt
                  )}
                />

                <InfoRow
                  label="Technical unit"
                  value={details.technicalUnit}
                />

                <InfoRow
                  label="Special bed needs"
                  value={details.specialBedNeeds}
                />

                <InfoRow
                  label="Transfer decided"
                  value={yesNo(
                    details.transferDecided
                  )}
                />

                <InfoRow
                  label="Patient ready"
                  value={yesNo(
                    details.patientReady
                  )}
                />
              </div>

              {details.reason && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500">
                    Reason
                  </div>
                  <div>{details.reason}</div>
                </div>
              )}
            </div>
          ) : referral.details ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 whitespace-pre-wrap text-gray-700">
              {referral.details}
            </div>
          ) : null}

          {!canEditStatus && (
            <div className="text-xs text-gray-500">
              Only the receiving unit can update
              referral status.
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}> Close </Button>
        <Button
          variant="contained"
          disabled={!canSave}
          onClick={() => {
            onUpdateStatus?.(
              referral.id,
              status
            );
            onClose();
          }}
        >
          Save status
        </Button>
      </DialogActions>
    </Dialog>
  );
};