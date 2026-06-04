import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.uuid(),
  doctorAssignmentId: z.uuid(),
  unitId: z.uuid(),

  scheduledAt: z.coerce.date(),

  duration: z.number().optional(),
  type: z.string().optional(),
  notes: z.string().optional().nullable(),
});
