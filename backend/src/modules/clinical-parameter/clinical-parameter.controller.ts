import { Request, Response } from "express";
import * as service from "./clinical-parameter.service.js";

export const createClinicalParameter = async (
  req: Request,
  res: Response
) => {
  const entry = await service.recordClinicalParameter(req.body);
  res.status(201).json(entry);
};

export const listClinicalParameters = async (
  req: Request,
  res: Response
) => {
  const encounterId = String(req.params.encounterId);
  const entries = await service.listClinicalParameters(encounterId);
  res.json(entries);
};
