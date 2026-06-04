// unit.repository.ts
import { prisma } from "../../config/prisma.js";

export const createUnit = (data: any) => {
  return prisma.unit.create({ data });
};

export const findByClinic = (clinicId: string) => {
  return prisma.unit.findMany({
    where: { clinicId },
    orderBy: { name: "asc" },
  });
};
