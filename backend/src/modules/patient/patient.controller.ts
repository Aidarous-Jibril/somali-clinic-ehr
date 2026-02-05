import { Request, Response } from "express";
import * as service from "./patient.service.js";

export const createPatient = async (req: Request, res: Response) => {
  const patient = await service.createPatient(req.body);
  res.status(201).json(patient);
};

export const listPatients = async (req: Request, res: Response) => {
  const clinicId = String(req.params.clinicId);
  const patients = await service.listPatients(clinicId);
  res.json(patients);
};
