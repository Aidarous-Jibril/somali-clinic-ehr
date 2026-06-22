import { Request, Response } from "express";
import * as service from "./patient.service.js";
import { Roles } from "../../constants/roles.js";

export const createPatient = async ( req: Request, res: Response) => {
  try {
    const patient = await service.createPatient( req.body, req.user );

    res.status(201).json({
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Patient already exists") 
      return res.status(409).json({ message: error.message, });

    res.status(500).json({ message: error.message, });
  }
};

export const listMyClinicPatients = async ( req: Request, res: Response ) => {
  try {
    const patients = await service.listPatients( req.user );

    res.json(patients);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({ message: error.message, });
  }
};

export const getPatient = async ( req: Request, res: Response ) => {
  try {
    const patientId = String(req.params.patientId);

    const patient = await service.getPatientById( patientId, req.user );

    res.json(patient);
  } catch (error: any) {
    console.error(error);

    if (error.message === "Patient not found") 
      return res.status(404).json({ message: error.message,});

    res.status(500).json({ message: error.message, });
  }
};

export const searchPatients = async ( req: Request, res: Response ) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.status(400).json({ message: "Search query is required", });

    const patients = await service.searchPatients( q, req.user );

    res.json(patients);
  } catch (error: any) {
    console.error(error);

    res.status(500).json({ message: error.message, });
  }
};

export const updatePatient = async ( req: Request, res: Response ) => {
  try {
    const patientId = String(req.params.patientId);

    const patient = await service.updatePatient(
      patientId,
      req.body,
      req.user
    );

    res.json({ message: "Patient updated successfully", data: patient, });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({ message: error.message, });
  }
};

export const deletePatient = async ( req: Request, res: Response ) => {
  try {
    const patientId = String(req.params.patientId);

    await service.deletePatient( patientId, req.user);

    res.status(204).send();
  } catch (error: any) {
    console.error(error);

    res.status(400).json({ message: error.message,});
  }
};