import { Request, Response } from "express";
import * as service from "./encounter.service.js";

export const createEncounter = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
  
    const encounter = await service.createEncounter({ ...req.body, clinicId: user.clinicId, });
  
    res.status(201).json(encounter);
  } catch (error: any) {
    console.error(error);

    if (error?.statusCode) {
      return res.status(error.statusCode).json({ message: error.message,});
    }

    res.status(500).json({ message: "Failed to create encounter", });
  }
};

export const listEncountersByPatient = async ( req: Request, res: Response) => {
  try {
    const patientId = String(req.params.patientId);
    const encounters = await service.listEncountersByPatient(patientId);
    res.json(encounters);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to load encounters", });
  }
};

export const getActiveEncounter = async (req: Request, res: Response) => {
  try {
    const patientId = String(req.params.patientId);
    const encounter = await service.getActiveEncounter(patientId);
  
   if (!encounter) return res.json(null);
  
    res.json(encounter);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to load active encounter", });
  }
};

export const closeEncounter = async (req: Request, res: Response) => {
  try {
    const encounterId = String(req.params.encounterId);
    const encounter = await service.closeEncounter(encounterId);
    res.json(encounter);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to close encounter", });
  }
};
