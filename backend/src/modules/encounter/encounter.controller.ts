import { Request, Response } from "express";
import * as service from "./encounter.service.js";

export const createEncounter = async (req: Request, res: Response) => {
  const encounter = await service.createEncounter(req.body);
  res.status(201).json(encounter);
};

export const listEncountersByPatient = async (
  req: Request,
  res: Response
) => {
  const patientId = String(req.params.patientId);
  const encounters = await service.listEncountersByPatient(patientId);
  res.json(encounters);
};

export const closeEncounter = async (req: Request, res: Response) => {
  const encounterId = String(req.params.encounterId);
  const encounter = await service.closeEncounter(encounterId);
  res.json(encounter);
};
