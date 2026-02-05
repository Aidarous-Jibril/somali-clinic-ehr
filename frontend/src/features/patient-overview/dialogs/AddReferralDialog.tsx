import React, { useEffect, useMemo, useState } from "react";
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

import type { Referral, ReferralRole, ReferralStatus } from "../../../features/patient-overview/types";
import { STAFF_BY_ROLE } from "../../../features/patient-overview/mockData";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (referral: Referral) => void;
};

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const makeSimpleId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const OTHER = "__OTHER__";

export const AddReferralDialog: React.FC<Props> = ({ open, onClose, onSave }) => {
  const statuses: ReferralStatus[] = useMemo(
    () => ["Unassessed", "Accepted", "In progress", "Completed"],
    []
  );

  const roleOptions: ReferralRole[] = useMemo(
    () => [
      "Doctor",
      "Nurse",
      "Physiotherapist",
      "Occupational therapist",
      "Dietitian",
      "Speech therapist",
      "Midwife",
      "Other",
    ],
    []
  );

  // You can tweak these lists anytime
  const toOptions = useMemo(
    () => [
      "Medical division",
      "Stroke ward",
      "Emergency department",
      "Radiology",
      "Physiotherapy",
      "Occupational therapy",
      "Other…",
    ],
    []
  );

  const fromOptions = useMemo(
    () => [
      "District health centre North",
      "District health centre South",
      "Home care service",
      "Outpatient clinic",
      "Emergency department",
      "Other…",
    ],
    []
  );

  // To/From selections + other
  const [toSelect, setToSelect] = useState<string>(toOptions[0] ?? "");
  const [fromSelect, setFromSelect] = useState<string>(fromOptions[0] ?? "");
  const [toOther, setToOther] = useState("");
  const [fromOther, setFromOther] = useState("");

  const [status, setStatus] = useState<ReferralStatus>("Unassessed");
  const [date, setDate] = useState<string>(todayISO());
  const [urgent, setUrgent] = useState(false);
  const [hasAdditionalInfo, setHasAdditionalInfo] = useState(false);
  const [details, setDetails] = useState("");

  // ✅ Sender (role -> name list)
  const [sentByRole, setSentByRole] = useState<ReferralRole>("Nurse");

  const nameOptions = useMemo(() => {
    const list = STAFF_BY_ROLE[sentByRole] ?? [];
    // avoid empty list causing unusable select
    return list.length ? list : [];
  }, [sentByRole]);

  const [sentByNameSelect, setSentByNameSelect] = useState<string>("");
  const [sentByNameOther, setSentByNameOther] = useState<string>("");
  const [sentByUnit, setSentByUnit] = useState<string>("");

  // When role changes, auto-pick first name (if any)
  useEffect(() => {
    if (!open) return;
    const first = nameOptions[0] ?? "";
    setSentByNameSelect(first);
    setSentByNameOther("");
  }, [sentByRole, nameOptions, open]);

  const isToOther = toSelect === "Other…";
  const isFromOther = fromSelect === "Other…";
  const isNameOther = sentByNameSelect === OTHER;

  const resolvedTo = () => (isToOther ? toOther.trim() : toSelect.trim());
  const resolvedFrom = () => (isFromOther ? fromOther.trim() : fromSelect.trim());
  const resolvedName = () => (isNameOther ? sentByNameOther.trim() : sentByNameSelect.trim());

  const reset = () => {
    setToSelect(toOptions[0] ?? "");
    setFromSelect(fromOptions[0] ?? "");
    setToOther("");
    setFromOther("");

    setSentByRole("Nurse");
    const firstNurse = (STAFF_BY_ROLE["Nurse"] ?? [])[0] ?? "";
    setSentByNameSelect(firstNurse);
    setSentByNameOther("");
    setSentByUnit("");

    setStatus("Unassessed");
    setDate(todayISO());
    setUrgent(false);
    setHasAdditionalInfo(false);
    setDetails("");
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSave = () => {
    const to = resolvedTo();
    const from = resolvedFrom();
    const name = resolvedName();

    if (!to || !from || !name) return;

    onSave({
      id: makeSimpleId(),
      to,
      from,
      sentByRole,
      sentByName: name,
      sentByUnit: sentByUnit.trim() ? sentByUnit.trim() : undefined,
      status,
      date: date.trim() || "Today",
      urgent,
      hasAdditionalInfo,
      details: details.trim() || "New referral created.",
    });

    reset();
    onClose();
  };

  // Build name select items: role-based + optional "Other…"
  const nameMenuItems = useMemo(() => {
    const items = [...nameOptions];
    // allow Other for "Other" role OR if list is empty
    const allowOther = sentByRole === "Other" || items.length === 0;
    return { items, allowOther };
  }, [nameOptions, sentByRole]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create referral</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="To"
            size="small"
            select
            value={toSelect}
            onChange={(e) => setToSelect(e.target.value)}
            fullWidth
          >
            {toOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          {isToOther && (
            <TextField
              label="To (other)"
              size="small"
              value={toOther}
              onChange={(e) => setToOther(e.target.value)}
              fullWidth
              autoFocus
            />
          )}

          <TextField
            label="From"
            size="small"
            select
            value={fromSelect}
            onChange={(e) => setFromSelect(e.target.value)}
            fullWidth
          >
            {fromOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          {isFromOther && (
            <TextField
              label="From (other)"
              size="small"
              value={fromOther}
              onChange={(e) => setFromOther(e.target.value)}
              fullWidth
            />
          )}

          {/* ✅ Sender row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Sent by (role)"
              size="small"
              select
              value={sentByRole}
              onChange={(e) => setSentByRole(e.target.value as ReferralRole)}
              fullWidth
            >
              {roleOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Sent by (name)"
              size="small"
              select
              value={sentByNameSelect}
              onChange={(e) => setSentByNameSelect(e.target.value)}
              fullWidth
              disabled={nameOptions.length === 0 && sentByRole !== "Other"}
              helperText={
                nameOptions.length === 0 && sentByRole !== "Other"
                  ? "No staff available for this role"
                  : undefined
              }
            >
              {nameMenuItems.items.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
              {nameMenuItems.allowOther && <MenuItem value={OTHER}>Other…</MenuItem>}
            </TextField>
          </Stack>

          {isNameOther && (
            <TextField
              label="Sent by (other name)"
              size="small"
              value={sentByNameOther}
              onChange={(e) => setSentByNameOther(e.target.value)}
              fullWidth
              autoFocus
            />
          )}

          <TextField
            label="Sender unit (optional)"
            size="small"
            value={sentByUnit}
            onChange={(e) => setSentByUnit(e.target.value)}
            fullWidth
            placeholder="e.g. Stroke ward / OPD / Clinic"
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Status"
              size="small"
              select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReferralStatus)}
              fullWidth
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date"
              size="small"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              helperText="Format: YYYY-MM-DD (or write Today)"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControlLabel
              control={<Checkbox checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />}
              label="Urgent"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={hasAdditionalInfo}
                  onChange={(e) => setHasAdditionalInfo(e.target.checked)}
                />
              }
              label="Has complementary answer"
            />
          </Stack>

          <TextField
            label="Details"
            size="small"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            multiline
            minRows={3}
            placeholder="Write short referral reason / notes…"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
