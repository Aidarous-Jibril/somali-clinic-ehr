import { Request, Response } from "express";
import * as service from "./clinic.service.js";

export const createClinic = async ( req: Request, res: Response ) => {
  try {
    const clinic = await service.createClinic( req.body);

    res.status(201).json(clinic);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create clinic",
    });
  }
};

export const listClinics = async ( req: Request, res: Response ) => {
  try {
    const clinics = await service.listClinics();

    res.json(clinics);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch clinics",
    });
  }
};