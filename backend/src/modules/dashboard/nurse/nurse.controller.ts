//dashboard/nurse/nurse.controller.ts
import { Request, Response } from "express";
import * as service from "./nurse.service.js";

export const getNurseAssignedPatients = async ( req: Request, res: Response ) => {
  const user = req.user;

  if (!user?.unitId) 
    return res.status(400).json({ message: "User has no assigned unit", });
  
  const data = await service.getNurseAssignedPatients(user.unitId);
  res.json(data);
};

export const getNurseMedicationDueNow = async ( req: Request, res: Response ) => {
  const user = req.user;

  if (!user?.unitId) 
    return res.status(400).json({ message: "User has no assigned unit", });

  const data = await service.getNurseMedicationDueNow(user.unitId);
  res.json(data);
};

export const getNurseVitalsOverdue = async ( req: Request, res: Response ) => {
  const user = req.user;

  if (!user?.unitId) 
    return res.status(400).json({ message: "User has no assigned unit", });

  const data = await service.getNurseVitalsOverdue(user.unitId);
  res.json(data);
};

export const getNurseFluidAlerts = async ( req: Request, res: Response ) => {
  const user = req.user;

  if (!user?.unitId) 
    return res.status(400).json({ message: "User has no assigned unit", });

  const data = await service.getNurseFluidAlerts(user.unitId);
  res.json(data);
};

export const getNursePendingReferrals = async ( req: Request, res: Response ) => {
  const user = req.user;

  if (!user?.unitId) 
    return res.status(400).json({ message: "User has no assigned unit", });

  const data = await service.getNursePendingReferrals(user.unitId);
  res.json(data);
};

export const getNurseWardOccupancy = async (req: Request, res: Response ) => {
  const user = req.user;

  if (!user?.unitId) {
    return res.status(400).json({ message: "User has no assigned unit", });
  }

  const data = await service.getNurseWardOccupancy(user.unitId);
  res.json(data);
};