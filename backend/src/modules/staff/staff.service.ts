import * as repo from "./staff.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this-in-production";

import { Roles } from "../../constants/roles.js";

export const createStaff = async ( input: any, currentUser: any ) => {
  // If the logged-in user is a ClinicAdmin and they are trying to create either:
  if ( currentUser.role === Roles.ClinicAdmin && [ Roles.SuperAdmin, Roles.ClinicAdmin, ].includes(input.role)) {
    throw new Error("Forbidden");
  }

  const hashedPassword = await bcrypt.hash( input.password, 10);

  return repo.createStaff({
    ...input,
    password: hashedPassword,
  });
};

export const login = async (email: string, password: string) => {
  const account = await repo.findStaffByEmail(email);

  if (!account || !account.password) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, account.password);

  if (!valid) throw new Error("Invalid credentials");

  const primary = account.assignments[0];

  const token = jwt.sign(
    {
      accountId: account.id,
      personId: account.personId,
      clinicId: account.clinicId,
      unitId: primary?.unitId ?? null,
      teamId: primary?.teamId ?? null,
      role: primary?.role ?? null,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    token,
    staff: {
      id: account.id,
      name: `${account.person.firstName} ${account.person.lastName}`,

      clinicId: account.clinicId,

      unitId: primary?.unitId ?? null,
      unitName: primary?.unit?.name ?? null,

      teamId: primary?.teamId ?? null,
      teamName: primary?.team?.name ?? null,

      role: primary?.role ?? null,
    },
  };
};

export const listStaff = (clinicId: string) => {
  return repo.findAll(clinicId);
};

export const listByUnit = (unitId: string) => {
  return repo.findByUnit(unitId);
};