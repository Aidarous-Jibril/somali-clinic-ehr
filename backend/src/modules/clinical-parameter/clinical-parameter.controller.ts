import { Request, Response } from "express";
import * as service from "./clinical-parameter.service.js";

export const createClinicalParameter = async ( req: Request, res: Response) => {
  try {
    const entry = await service.recordClinicalParameter({ ...req.body, clinicId: req.user!.clinicId, recordedByAccountId: req.user?.accountId,  });

    res.status(201).json(entry);

  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: error.message, });    
  }
};

export const listClinicalParameters = async ( req: Request, res: Response ) => {
  try {
      const encounterId = String(req.params.encounterId);
      const entries = await service.listClinicalParameters(encounterId, req.user!.clinicId );
    
      const result = entries.map((e: any) => ({
        id: e.id,
        name: e.name,
        value: e.value,
        note: e.note,
        recordedAt: e.recordedAt,
        recordedBy: e.recordedByAccount ? `${e.recordedByAccount.person.firstName} ${e.recordedByAccount.person.lastName}` : null,
      }));
    
      res.json(result);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });    
  }
};