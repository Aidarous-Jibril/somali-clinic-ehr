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

export const updateNutritionProduct = (
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

export const deleteNutritionProduct = (id: string) => {
  return prisma.nutritionPrescription.delete({
    where: { id },
  });
};