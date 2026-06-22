import * as repo from "./staff.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this-in-production";

import { Roles } from "../../constants/roles.js";

export const createStaff = async (input: any, currentUser: any) => {
  if ( currentUser.role === Roles.ClinicAdmin && [Roles.SuperAdmin, Roles.ClinicAdmin].includes(input.role) ) {
    throw new Error("Forbidden");
  }

  // SuperAdmin can choose clinic and ClinicAdmin is locked to own clinic
  const clinicId = currentUser.role === Roles.SuperAdmin ? input.clinicId : currentUser.clinicId;

  if (input.unitId) {
    const unit = await repo.findUnitById(input.unitId);

    if (!unit) throw new Error("Unit not found");

    if (unit.clinicId !== clinicId) throw new Error("Forbidden");
  
  }

  if (input.teamId && !input.unitId)  throw new Error("Unit required when assigning a team");
  
  if (input.teamId) {
    const team = await repo.findTeamById(input.teamId);

    if (!team) throw new Error("Team not found");

    if (team.clinicId !== clinicId) throw new Error("Forbidden");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  return repo.createStaff({
    ...input,
    clinicId,
    password: hashedPassword,
  });
};

export const login = async (clinicCode: string, email: string, password: string) => {
  const account = await repo.findStaffByEmail(clinicCode, email);

  if (!account || !account.password) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, account.password);

  if (!valid) throw new Error("Invalid credentials");

  const primary = account.assignments[0];

  const token = jwt.sign(
    {
      accountId: account.id,
      personId: account.personId,
      clinicId: account.clinicId,
      clinicCode: account.clinic.code,
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
      clinicCode: account.clinic.code,
      clinicName: account.clinic.name,

      email: account.email,

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


export const listByUnit = async ( unitId: string, user: any ) => {
  const unit = await repo.findUnitById( unitId);

  if (!unit)  throw new Error("Unit not found");

  if ( user.role !== Roles.SuperAdmin && unit.clinicId !== user.clinicId ) 
    throw new Error("Forbidden");

  return repo.findByUnit(unitId);
};