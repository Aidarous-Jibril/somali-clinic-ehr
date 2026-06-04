import { z } from "zod";

export const uuidSchema = z.string().min(1);

export const optionalText = z.string().optional();

export const requiredText = (message: string) =>
  z.string().min(1, message);