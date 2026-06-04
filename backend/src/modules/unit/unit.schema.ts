// unit.schema.ts
import { z } from "zod";

export const createUnitSchema = z.object({
  clinicId: z.uuid(),
  name: z.string().min(1),
});
