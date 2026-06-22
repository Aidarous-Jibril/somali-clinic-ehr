import { z } from "zod";

export const createPatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(
      ["male", "female", "other", "unknown"],
      {
        message: "Gender must be male, female, other, or unknown",
      }
    ),
  dateOfBirth: z.iso.date({ message: "Date of birth must be in YYYY-MM-DD format", }),
  phone: z.string().optional(),
  email: z.email("Please enter a valid email address").optional(),
  nationalId: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer< typeof createPatientSchema >;

export type UpdatePatientInput = z.infer< typeof updatePatientSchema >;