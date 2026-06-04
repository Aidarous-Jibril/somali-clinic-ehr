// fluidBalance.controller.ts
import { Request, Response } from "express";
import * as service from "./fluidBalance.service.js";

export const createFluidBalance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
  
    const entry = await service.registerFluidBalance(req.body, user);
  
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to create fluid balance entry", });
  }
};

export const getByPatient = async (req: Request, res: Response) => {
 try {
   const user = (req as any).user;
   if (!user) return res.status(401).json({ message: "Unauthorized" });
 
   const patientId = req.params.patientId as string;
 
   const entries = await service.listFluidBalanceForPatient(patientId, user);
   res.json(entries);
 } catch (error) {
   console.error(error);

    res.status(500).json({ message: "Failed to load fluid balance entries", });
 }
};