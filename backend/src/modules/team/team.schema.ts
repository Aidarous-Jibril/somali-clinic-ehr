import { z } from "zod";

export const createTeamSchema = z.object({
  clinicId: z.uuid(),
  unitId: z.uuid(),
  name: z.string().min(1),
});

export const mapTeam = (row: any) => ({
  id: row.id,
  name: row.name,
  clinicId: row.clinicId,
  unitId: row.unitId,
});