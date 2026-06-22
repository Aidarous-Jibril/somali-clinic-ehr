import { Request, Response } from "express";
import * as service from "./referral.service.js";

export const createReferral = async (req: Request, res: Response) => {
  try {
    if (!req.user?.unitId) 
      return res.status(400).json({ message: "User has no assigned unit",});

    const referral = await service.createReferral({
      ...req.body,
      sentByAccountId: req.user!.accountId,
      fromClinicId: req.user!.clinicId,
      fromUnitId: req.user!.unitId,
    });

    res.status(201).json(referral);
  } catch (error: any) {
    console.error(error);
    
    res.status(error?.statusCode || 400).json({ message: error?.message || "Failed to create referral", });
  }
};

export const listByPatient = async (req: Request, res: Response) => {
  try {
    const referrals = await service.listByPatient(
      String(req.params.patientId),
      req.user!.clinicId,
    );
  
    res.json(referrals);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to fetch referrals", });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const updated = await service.updateReferralStatus(
      String(req.params.id),
      req.body.status,
      req.user!.unitId!,
    );
  
    res.json(updated);
  } catch (error: any) {

    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to update referral status", });
  }
};

export const listIncoming = async (req: Request, res: Response) => {
  try {
    const referrals = await service.listIncoming(req.user!.unitId!);

    return res.json(referrals);
  } catch (error: any) {
    console.error(error);

    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to fetch incoming referrals", });
  }
};

export const listOutgoing = async (req: Request, res: Response) => {
  try {
    const referrals = await service.listOutgoing(req.user!.unitId!);

    return res.json(referrals);
  } catch (error: any) {
    console.error(error);

    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to fetch outgoing referrals", });
  }
};