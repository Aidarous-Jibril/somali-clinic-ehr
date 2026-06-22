import { Request, Response } from "express";
import * as service from "./labResult.service.js";

export const createLabResult = async (req: Request, res: Response) => {
  const result = await service.createLabResult(
    req.body,
    req.user!
  );

  return res.status(201).json(result);
};

export const listResultsByPatient = async ( req: Request, res: Response ) => {
  const results = await service.listResultsByPatient(
    String(req.params.patientId),
    req.user!.clinicId
  );

  return res.json(results);
};