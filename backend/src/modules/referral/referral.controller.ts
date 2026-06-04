import { Request, Response } from "express";
import * as service from "./referral.service.js";

export const createReferral = async ( req: Request, res: Response ) => {
  const referral =
    await service.createReferral({
      ...req.body,
      sentByAccountId: req.user!.accountId,
      fromClinicId: req.user!.clinicId, 
      fromUnitId: req.user!.unitId,
    });

  res.status(201).json(referral);
};

export const listByPatient = async ( req: Request, res: Response ) => {
  const referrals = await service.listByPatient(
      String(req.params.patientId),
      req.user!.clinicId
    );

  res.json(referrals);
};

export const updateStatus = async ( req: Request, res: Response ) => {
  const updated = await service.updateReferralStatus(
      String(req.params.id),
      req.body.status,
      req.user!.unitId!
    );

  res.json(updated);
};

export const listIncoming = async ( req: Request, res: Response ) => {
  const referrals = await service.listIncoming(
      req.user!.unitId!
    );

  res.json(referrals);
};

export const listOutgoing = async ( req: Request, res: Response ) => {
  const referrals =
    await service.listOutgoing(
      req.user!.unitId!
    );

  res.json(referrals);
};