// fluidBalance.controller.ts
import { Request, Response } from "express";
import * as service from "./fluidBalance.service.js";

export const createFluidBalance = async (req: Request, res: Response) => {
  const entry = await service.registerFluidBalance(req.body);
  res.status(201).json(entry);
};

export const getByPatient = async (req: Request, res: Response) => {
  const patientId  = req.params.patientId as string;
  const entries = await service.listFluidBalanceForPatient(patientId);
  res.json(entries);
};
