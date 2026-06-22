import { z } from "zod";

const statusSchema = z.enum(
  ["active", "ended", "upcoming", "cancelled"],
  {
    message: "Invalid consent status",
  }
);

export const createConsentSchema = z.object({
  patientId: z.string().uuid(),
  type: z.string().min(1),
  title: z.string().min(1),
  organizationLine: z.string().min(1),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  status: statusSchema,
});

export const updateConsentStatusSchema = z.object({
  status: statusSchema,
});