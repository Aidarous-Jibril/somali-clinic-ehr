import * as repo from "./team.repository.js";
import { mapTeam } from "./team.schema.js";
import { Roles } from "../../constants/roles.js";

export const getTeams = async ( clinicId?: string, unitId?: string, user?: any ) => {
  if (
    user?.role !== Roles.SuperAdmin && clinicId && clinicId !== user.clinicId ) {
    throw new Error( "You can only view teams from your own clinic");
  }

  if (user?.role !== Roles.SuperAdmin) {
    clinicId = user.clinicId;
  }

  if (!clinicId) 
    throw new Error("clinicId is required");

  const rows = await repo.findTeams(clinicId, unitId);

  return rows.map(mapTeam);
};


export const createTeam = async ( data: { name: string; clinicId: string; unitId: string; }, user?: any ) => {
  if (user?.role === Roles.ClinicAdmin) {
    data.clinicId = user.clinicId;
  }

  const unit = await repo.findUnitById(data.unitId);

  if (!unit) 
    throw new Error("Unit not found");

  if (unit.clinicId !== data.clinicId) 
    throw new Error("Unit does not belong to clinic");

  const existingTeam = await repo.findTeamByName( data.unitId, data.name );

  if (existingTeam)
    throw new Error( "A team with this name already exists in this unit");

  return repo.insertTeam({
      ...data,
      name: data.name.trim(),
  });
};