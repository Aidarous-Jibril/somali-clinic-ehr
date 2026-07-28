//modules/dashboard/radiology/radiology.controller.ts
import { Request, Response } from "express";

import * as service from "./radiology.service.js";
import { toRadiologyWorklistItem } from "./radiology.mapper.js";

export const getRadiologyWorklist = async ( req: Request, res: Response, ) => {
  try {
    const orders = await service.getRadiologyWorklist(
      req.user!.clinicId,
    );

    const mapped = orders.map(toRadiologyWorklistItem);

    return res.json(mapped);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};