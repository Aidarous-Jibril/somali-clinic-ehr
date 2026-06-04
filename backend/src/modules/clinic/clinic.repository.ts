import { prisma } from "../../config/prisma.js";

export const createClinic = (data: { name: string; code: string; }) =>
  prisma.clinic.create({ data, });

export const findAll = () => prisma.clinic.findMany({
    select: {
      id: true,
      name: true,
      code: true,
    },
    orderBy: {
      name: "asc",
    },
  });