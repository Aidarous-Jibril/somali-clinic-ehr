import { Request, Response } from "express";
import * as service from "./careOverview.service.js";

export const getCareOverviewByPatient = async ( req: Request, res: Response ) => {
  const patientId  = req.params.patientId as string
  const data = await service.getCareOverviewForPatient(patientId);

  res.json(data);
};
