// backend/src/modules/medication/nutrition-product/nutrition-product.repository.ts

import { prisma } from "../../config/prisma.js";

export const createNutritionProduct = (data: {
  patientId: string;
  productName: string;
  description?: string;
  articleNo?: string;
  productArea?: string;
  prescribedAt?: string;
  validUntil?: string;
  prescriber?: string;
}) => {
  return prisma.nutritionPrescription.create({
    data: {
      ...data,
      prescribedAt: data.prescribedAt
        ? new Date(data.prescribedAt)
        : new Date(),
      validUntil: data.validUntil
        ? new Date(data.validUntil)
        : null,
    },
  });
};

export const findByPatient = (patientId: string) => {
  return prisma.nutritionPrescription.findMany({
    where: { patientId },
    orderBy: { prescribedAt: "desc" },
  });
};

export const updateNutritionProduct = async (
  id: string,
  data: Partial<{
    productName: string;
    description?: string;
    articleNo?: string;
    productArea?: string;
    prescribedAt?: string;
    validUntil?: string;
    prescriber?: string;
    status: "valid" | "expired" | "cancelled";
  }>
) => {
  const existing = await prisma.nutritionPrescription.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Nutrition product not found");
  }

  return prisma.nutritionPrescription.update({
    where: { id },
    data: {
      ...data,
      prescribedAt: data.prescribedAt
        ? new Date(data.prescribedAt)
        : undefined,
      validUntil:
        data.validUntil !== undefined
          ? data.validUntil
            ? new Date(data.validUntil)
            : null
          : undefined,
    },
  });
};

export const deleteNutritionProduct = async (id: string) => {
  const existing = await prisma.nutritionPrescription.findUnique({
    where: { id },
  });

  if (!existing) throw new Error("Nutrition product not found");
  

  return prisma.nutritionPrescription.delete({
    where: { id },
  });
};


export const findById = (id: string) =>
  prisma.nutritionPrescription.findUnique({
    where: { id },
  });

export const findPatientById = (id: string) =>
  prisma.patient.findUnique({
    where: {id}
  })
