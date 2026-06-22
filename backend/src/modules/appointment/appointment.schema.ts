import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.uuid({ message: "Patient ID must be valid", }),
  doctorAssignmentId: z.uuid({ message: "Doctor assignment ID must be valid", }),
  unitId: z.uuid({ message: "Unit ID must be valid",}),
  scheduledAt: z.coerce.date({ message: "Scheduled date is required",}),

  duration: z.number().optional(),
  type: z.string().optional(),
  notes: z.string().optional().nullable(),
});
