import { z } from "zod";

export const createStaffSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),

  role: z.enum([
    "SuperAdmin",
    "ClinicAdmin",

    "Doctor",
    "Nurse",

    "Lab",
    "Radiology",

    "Physiotherapist",
    "OccupationalTherapist",
    "Dietitian",
    "SpeechTherapist",
    "Midwife",
    
    "Other",
  ]),

  // clinicId: z.uuid(),
  clinicId: z.uuid().optional(),
  unitId: z.uuid().optional(),
  teamId: z.uuid().optional(),
  email: z.email(),
  password: z.string().min(6),

  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  nationalId: z.string().optional(),
});