//seeders/shared/passwords.ts
import bcrypt from "bcrypt";

export const DEFAULT_PASSWORD = "password123";

export const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);