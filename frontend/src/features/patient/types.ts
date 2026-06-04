// src/features/patient/types.ts

export type Gender = "male" | "female" | "other";

export type Patient = {
  id: string;
  mrn: string;
  clinicId: string;

  firstName: string;
  lastName: string;

  gender: Gender;
  dateOfBirth: string;

  phone?: string;
  email?: string;
  nationalId?: string;
  
  unit?: string;
  clinic?: {
    id: string;
    code: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePatientPayload = {
  clinicId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  phone?: string;
  email?: string;
  nationalId?: string;
};

export type UpdateOrderPayload = Partial<{
  category: string;
  code: string;
  name: string;
  orderedBy: string;
  status: string;
}>;