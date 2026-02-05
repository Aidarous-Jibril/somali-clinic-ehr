import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import type { ConsentRecord } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onRegister: (consent: ConsentRecord) => void;

  // optional “context” (later can come from selected patient / unit)
  organizationLine?: string;
};

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysISO(baseISO: string, days: number) {
  const d = new Date(baseISO);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function RegisterConsentDialog({
  open,
  onClose,
  onRegister,
  organizationLine = "REGION EDUCATION, MEDICINE DIVISION",
}: Props) {
  const defaultStart = useMemo(() => todayISO(), []);
  const defaultEnd = useMemo(() => addDaysISO(defaultStart, 30), [defaultStart]);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const handleRegister = () => {
    const newConsent: ConsentRecord = {
      id: `consent-${crypto.randomUUID()}`,
      type: "shared_healthrecord",
      title: "Shared health record",
      organizationLine,
      startDate,
      endDate,
      status: "Active",
    };
    onRegister(newConsent);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register consent</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Consent for shared health record
        </Typography>

        <div className="rounded border bg-gray-50 p-3 mb-4">
          <Typography variant="subtitle2">Consent applies to</Typography>
          <Typography variant="body2">{organizationLine}</Typography>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Avbryt</Button>
        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}
