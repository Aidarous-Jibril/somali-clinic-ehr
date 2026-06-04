import { Request, Response } from "express";
import * as service from "./patient.service.js";

export const createPatient = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const patient = await service.createPatient({ ...req.body, clinicId: user.clinicId, });
    return res.status(201).json(patient);
  } catch (error: any) {
    if (error.message === "Patient already exists")
      return res.status(409).json({ message: error.message });

    return res.status(500).json({ message: "Failed to create patient" });
  }
};

export const listMyClinicPatients = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
  
    const patients = await service.listPatients(user.clinicId);
  
    res.json(patients);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to load patients",});
  }
};

export const getPatient = async (req: Request, res: Response) => {
  try {
    const patientId = String(req.params.patientId);
    const patient = await service.getPatientById(patientId);
  
    res.json(patient);
  } catch (error: any) {
    console.error(error);

    if (error.message === "Patient not found") {
      return res.status(404).json({ message: error.message, });
    }

    res.status(500).json({ message: "Failed to load patient",  });
  }
};

export const searchPatients = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const q = String(req.query.q || "").trim();
  
    if (!user) return res.status(401).json({ message: "Unauthorized" });
  
    const patients = await service.searchPatients(user.clinicId, q);
    res.json(patients);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to search patients", });
  }
};