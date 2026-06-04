import { Request, Response } from "express";
import * as service from "./careOverview.service.js";

export const getCareOverviewByPatient = async ( req: Request, res: Response ) => {
  try {
    const patientId = String(req.params.patientId);

    const data = await service.getCareOverviewForPatient( patientId);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to load care overview", });
  }
};