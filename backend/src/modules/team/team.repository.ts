import { prisma } from "../../config/prisma.js";

export const findTeams = ( clinicId: string, unitId?: string ) =>
  prisma.team.findMany({
    where: {
      clinicId,
      ...(unitId && { unitId }),
    },
    orderBy: {
      name: "asc",
    },
  });

export const insertTeam = (
  data: {
    name: string;
    clinicId: string;
    unitId: string;
  }
) =>
  prisma.team.create({
    data,
  });


export const findUnitById = (id: string) =>
  prisma.unit.findUnique({
    where: { id },
  });