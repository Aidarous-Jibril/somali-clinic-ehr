import { useState } from "react";
import { Button } from "@mui/material";


import { CreateAppointmentDialog } from "../features/appointments/dialogs/CreateAppointmentDialog";
import { AppointmentsTable } from "../components/appointments/AppointmentsTable";
import { useAppointments } from "../hooks/appointments/useAppointments";
import { useStaff } from "../hooks/staff/useStaff";
import { usePatients } from "../hooks/patient/usePatients";


const AppointmentsPage = () => {
  const { appointments, markArrived, start, complete, cancel, refetch } = useAppointments();
const { data: staff = [] } = useStaff();
const { data: patients = [] } = usePatients();
console.log("staff:", staff)
  // filter doctors
  const doctors = staff
    .filter((s) => s.role === "Doctor")
    .map((s) => ({
      id: s.id,
      name: s.name,
    }));
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Appointments</h1>

        <Button variant="contained" onClick={() => setOpen(true)}>
          + New Appointment
        </Button>
      </div>

      <AppointmentsTable
        data={appointments}
        onArrived={markArrived}
        onStart={start}
        onComplete={complete}
        onCancel={cancel}
      />
      <CreateAppointmentDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={refetch}
        patients={patients}
        doctors={doctors}
      />
    </div>
  );
};

export default AppointmentsPage;