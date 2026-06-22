import { Request, Response } from "express";
import * as service from "./medication-dose.service.js";

export const createDose = async ( req: Request, res: Response, ) => {
  try {
    const medicationId = String(req.params.id);
  
    const dose = await service.createDose(
      medicationId,
      req.body,
      req.user!.clinicId
    );
  
    res.status(201).json(dose);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to prepare dose", });
  }
};

export const prepareDose = async ( req: Request,res: Response ) => {
  try {
    const result = await service.prepareDose(
      String(req.params.doseId),
      req.user!.accountId,
      req.user!.clinicId
    );
  
    res.json(result);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to prepare dose",});
  }
};

export const administerDose = async ( req: Request, res: Response ) => {
  try {
    const result = await service.administerDose(
      String(req.params.doseId),
      req.body,
      req.user!.accountId,
      req.user!.clinicId
    );
  
    res.json(result);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to administer dose",});
  }
};

export const selfAdministerDose = async (req: Request, res: Response ) => {
  try {
    const result = await service.selfAdministerDose(
      String(req.params.doseId),
      req.user!.accountId,
      req.user!.clinicId
    );
  
    res.json(result);
  } catch (error: any) {
     return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to self-administer dose",});
  }
};

export const skipDose = async ( req: Request, res: Response ) => {
  try {
    const result = await service.skipDose(
      String(req.params.doseId),
      req.body,
      req.user!.accountId,
      req.user!.clinicId
    );
  
    res.json(result);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to skip dose",});
  }
};

export const listAdministrations = async (req: Request,res: Response ) => {
  try {
    const medicationId = String(req.params.id);
  
    const rows = await service.listAdministrations( medicationId,  req.user!.clinicId);
  
    const result = rows.map((row: any) => ({
      id: row.id,
      action: row.action,
      administeredDose: row.administeredDose,
      batchNumber: row.batchNumber,
      comment: row.comment,
      reason: row.reason,
      performedAt: row.performedAt,
  
      performedBy: row.performedByAccount ? `${row.performedByAccount.person.firstName} ${row.performedByAccount.person.lastName}` : null,
  
      doseLabel: row.dose?.label ?? null,
    }));
  
    res.json(result);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to fetch administrations",});
  }
};