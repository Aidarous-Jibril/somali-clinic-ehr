import { Request, Response } from "express";
import * as service from "./consent.service.js";

export const getByPatient = async ( req: Request, res: Response ) => {
  try {
    const patientId = String(req.params.patientId);
    const data = await service.getPatientConsents(patientId);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load consents",
    });
  }
};

export const create = async (req: Request, res: Response ) => {
  try {
    const data = await service.registerConsent({
      ...req.body,
      clinicId: req.user!.clinicId,
      createdByStaffId: req.user!.accountId,
    });

    res.status(201).json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create consent",
    });
  }
};

export const updateStatus = async ( req: Request, res: Response ) => {
  try {
    const id = String(req.params.id);
    const status = String(req.body.status);

    if (!status) return res.status(400).json({ message: "status is required", });

    const data = await service.changeConsentStatus( id, status);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update consent",
    });
  }
};