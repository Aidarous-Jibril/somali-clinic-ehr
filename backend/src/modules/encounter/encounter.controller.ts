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

    if (error?.statusCode) 
      return res.status(error.statusCode).json({ message: error.message,});

    res.status(500).json({ message: error.message, });
  }
};

export const listEncountersByPatient = async ( req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized",});
  
    const patientId = String(req.params.patientId);
    const clinicId = user.role === "SuperAdmin" ? undefined : user.clinicId;

    const encounters = await service.listEncountersByPatient(patientId, clinicId);
    res.json(encounters);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, });
  }
};

export const getActiveEncounter = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized", });
    
    const patientId = String(req.params.patientId);
    const clinicId = user.role === "SuperAdmin" ? undefined : user.clinicId;

    const encounter = await service.getActiveEncounter( patientId, clinicId);
  
   if (!encounter) return res.json(null);
  
    res.json(encounter);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, });
  }
};

export const closeEncounter = async ( req: Request, res: Response ) => {
  try {
    const user = req.user;

    if (!user)  return res.status(401).json({ message: "Unauthorized", });

    const encounterId = String( req.params.encounterId);
    const clinicId = user.role === "SuperAdmin" ? undefined : user.clinicId;

    const encounter = await service.closeEncounter( encounterId, clinicId );

    res.json(encounter);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message, });
  }
};
