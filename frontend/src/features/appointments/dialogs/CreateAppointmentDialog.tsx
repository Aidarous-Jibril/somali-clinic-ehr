import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

import { toast } from "react-toastify";
import { createAppointment } from "../../../api/appointments";

// TYPES
type Patient = {
  id: string;
  firstName: string;
  lastName: string;
};

type Staff = {
  id: string;
  name: string;
  role: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;

  patients: Patient[];
  doctors: Staff[];
};

export const CreateAppointmentDialog = ({
  open,
  onClose,
  onSuccess,
  patients,
  doctors,
}: Props) => {
  // STATE
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Staff | null>(null);
  const [scheduledAt, setScheduledAt] = useState<Dayjs | null>(dayjs());
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState<number>(30); 
console.log("selectedDoctor:", selectedDoctor)
  // CREATE HANDLER
  const handleCreate = async () => {
    if (!selectedPatient || !selectedDoctor || !scheduledAt) {
      toast.error("Please fill all required fields");
      return;
    }

    if (duration <= 0) {
      toast.error("Duration must be greater than 0");
      return;
    }

    const user = JSON.parse(localStorage.getItem("auth_user") || "{}");

    const payload = {
      patientId: selectedPatient.id,
      // doctorId: selectedDoctor.id,
      doctorAssignmentId: selectedDoctor.id,
      unitId: user.unitId,
      scheduledAt: scheduledAt.toISOString(),
      duration, // 🔥 NOW INCLUDED
      notes: notes || undefined,
    };

    try {
      console.log("payload", payload);
      await createAppointment(payload);

      toast.success("Appointment created");
      onSuccess();
      onClose();

      // reset form
      setSelectedPatient(null);
      setSelectedDoctor(null);
      setScheduledAt(dayjs());
      setNotes("");
      setDuration(30); // 🔥 reset
    } catch (err: any) {
      console.error("ERROR 👉", err.response?.data);
      toast.error(
        err?.response?.data?.message || "Failed to create appointment"
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Appointment</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* 🔍 PATIENT */}
          <Autocomplete
            options={patients}
            value={selectedPatient}
            onChange={(_, value) => setSelectedPatient(value)}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Patient" required />
            )}
          />

          {/* 🔍 DOCTOR */}
          <Autocomplete
            options={doctors}
            value={selectedDoctor}
            onChange={(_, value) => setSelectedDoctor(value)}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Doctor" required />
            )}
          />

          {/* 📅 DATE TIME */}
          <DateTimePicker
            label="Date & Time"
            value={scheduledAt}
            onChange={(newValue) => setScheduledAt(newValue)}
            disablePast
          />

          {/* ⏱️ DURATION */}
          <TextField
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            inputProps={{ min: 5, step: 5 }}
            fullWidth
          />

          {/* 📝 NOTES */}
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};