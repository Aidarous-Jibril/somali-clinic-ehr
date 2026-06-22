import { z } from "zod";

export const createStaffSchema = z.object({
  firstName: z.string().min(1, { message: "Frist name is required",}),
  lastName: z.string().min(1, { message: "Last name is required", }),

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

  clinicId: z.uuid().nullable().optional(),
  unitId: z.uuid().optional(),
  teamId: z.uuid().optional(),
  email: z.email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters", }),

  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  nationalId: z.string().optional(),
});