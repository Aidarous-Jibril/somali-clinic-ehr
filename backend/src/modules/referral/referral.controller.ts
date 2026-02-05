import { Request, Response } from "express";
import * as service from "./referral.service.js";

export const createReferral = async (req: Request, res: Response) => {
  const referral = await service.createReferral(req.body);
  res.status(201).json(referral);
};

export const listByPatient = async (req: Request, res: Response) => {
  const patientId = String(req.params.patientId);
  const referrals = await service.listByPatient(patientId);
  res.json(referrals);
};

export const updateStatus = async (req: Request, res: Response) => {
  const referralId = String(req.params.id);
  const referral = await service.updateReferralStatus( referralId, req.body.status );
  res.json(referral);
};
