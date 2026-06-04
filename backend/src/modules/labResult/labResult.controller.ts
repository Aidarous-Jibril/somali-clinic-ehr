import { Request, Response } from "express";
import * as service from "./labResult.service.js";

export const createLabResult = async (req: Request, res: Response) => {
  const result = await service.createLabResult(req.body);
  res.status(201).json(result);
};


export const listResultsByPatient = async ( req: Request, res: Response ) => {
  const results =
    await service.listResultsByPatient(
      String(req.params.patientId),
      req.user!.clinicId
    );

  res.json(results);
};
