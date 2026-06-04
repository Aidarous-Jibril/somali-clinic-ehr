import { Request, Response } from "express";
import * as service from "./unit.service.js";

export const createUnit = async ( req: Request, res: Response ) => {
  try {
    const unit = await service.createUnit( req.body, req.user);

    res.status(201).json(unit);
  } catch (error: any) {
    console.error(error);

    res.status(403).json({ message: error.message, });
  }
};

export const listByClinic = async ( req: Request, res: Response ) => {
  try {
    const clinicId = String( req.params.clinicId );

    if (!clinicId) return res.status(400).json({ message: "clinicId param required", });

    const units = await service.listUnitsByClinic( clinicId );

    res.json(units);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to fetch units", });
  }
};

export const listUnitsByClinic = async ( req: Request, res: Response ) => {
  try {
    const clinicId =
      req.query.clinicId as string;

    if (!clinicId)  return res.status(400).json({ message: "clinicId query param required", });

    const units = await service.listUnitsByClinic( clinicId );

    res.json(units);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch units",
    });
  }
};