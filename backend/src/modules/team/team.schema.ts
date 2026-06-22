import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1, { message: "Team name is required", }),
  clinicId: z.uuid({ message: "Clinic ID must be a valid UUID",}),
  unitId: z.uuid({ message: "Unit ID must be a valid UUID",}),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;

export const mapTeam = (row: any) => ({
  id: row.id,
  name: row.name,
  clinicId: row.clinicId,
  unitId: row.unitId,
});