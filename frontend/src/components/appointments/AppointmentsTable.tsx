// src/features/appointments/components/AppointmentsTable.tsx
import { toast } from "react-toastify";
import { Button, Chip, Stack, } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LoginIcon from "@mui/icons-material/Login";

import type { Appointment } from "../../features/appointments/types";
import { formatDateTime } from "../../utils/dateFormat";


type Props = {
  data: Appointment[];
  onArrived: (id: string) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void; 
};

const statusColor = (status: string) => {
  switch (status) {
    case "booked": return "default";
    case "arrived": return "info";
    case "in_progress": return "warning";
    case "completed": return "success";
    case "cancelled": return "error";
    default: return "default";
  }
};

export const AppointmentsTable = ({
  data,
  onArrived,
  onStart,
  onComplete,
  onCancel
}: Props) => {
  return (
    <div className="border rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Time</th>
            <th className="p-2">Patient</th>
            <th className="p-2">Doctor</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-2">
                 {formatDateTime(a.scheduledAt)}
              </td>

              <td className="p-2">
                {a.patient?.firstName} {a.patient?.lastName}
              </td>

              <td className="p-2">{a.doctor?.name}</td>

              <td className="p-2">
                <Chip label={a.status} color={statusColor(a.status) as any} size="small" />
              </td>

              <td className="p-2">
                <Stack direction="row" spacing={1}>
                  {a.status === "booked" && (
                    <Button size="small" variant="contained" color="info"
                      startIcon={<LoginIcon />}
                      onClick={() => onArrived(a.id)}
                    >
                      Arrived
                    </Button>
                  )}

                  {a.status === "arrived" && (
                    <Button size="small" variant="contained" color="warning"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => onStart(a.id)}
                    >
                      Start
                    </Button>
                  )}

                  {a.status === "in_progress" && (
                    <Button size="small" variant="contained" color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => onComplete(a.id)}
                    >
                      Complete
                    </Button>
                  )}
                  {a.status !== "completed" && a.status !== "cancelled" && (
<Button
  size="small"
  variant="outlined"
  color="error"
  sx={{ ml: 1 }}
  onClick={() => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      onCancel(a.id);
      toast.success("Appointment cancelled");
    }
  }}
>
  Cancel
</Button>
                )}
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};