import { Request, Response } from "express";
import * as service from "./team.service.js";

export const getTeamsHandler = async ( req: Request, res: Response ) => {
  try {
    const clinicId = String( req.query.clinicId || "" );

    const unitId = String( req.query.unitId || "" );

    const data = await service.getTeams( clinicId, unitId, req.user );

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to fetch teams", });
  }
};

export const createTeamHandler = async ( req: Request, res: Response ) => {
  try {
    const team =
      await service.createTeam( req.body, req.user );

    res.status(201).json(team);
  } catch (error: any) {
      console.error(error);

      res.status(400).json({ message: error.message, });
  }
};