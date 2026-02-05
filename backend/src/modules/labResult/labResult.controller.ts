import { Request, Response } from "express";
import * as service from "./labResult.service.js";

export const createLabResult = async (req: Request, res: Response) => {
  const result = await service.createLabResult(req.body);
  res.status(201).json(result);
};

export const listResultsByPatient = async (req: Request, res: Response) => {
  const patientId = (req.params.patientId as string).trim();

  const results = await service.listResultsByPatient(patientId);
  res.json(results);
};

