// unit.schema.ts
import { z } from "zod";

export const createUnitSchema = z.object({
  clinicId: z.uuid({ message: "Clinic ID must be a valid UUID", }),
  name: z.string().min(1, { message: "Unit name is required", }),
});