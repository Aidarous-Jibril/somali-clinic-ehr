import { Request, Response } from "express";
import * as service from "./medication.service.js";

export const createMedication = async (req: Request, res: Response) => {
  const med = await service.createMedication(req.body);
  res.status(201).json(med);
};

export const listActiveMedications = async (req: Request, res: Response) => {
    console.log("PARAMS_ID", req.params.patientId)
  const patientId = String(req.params.patientId);
  const meds = await service.listActiveMedications(patientId);
  res.json(meds);
};

export const stopMedication = async (req: Request, res: Response) => {
//   const medId = String(req.params.encounterId);
  const medId = String(req.params.id);
  const med = await service.stopMedication(medId);
  res.json(med);
};

export const pauseMedication = async (req: Request, res: Response) => {
//   const medId = String(req.params.encounterId);
  const medId = String(req.params.id);
  const med = await service.pauseMedication(medId);
  res.json(med);
};
