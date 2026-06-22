import { Request, Response } from "express";
import * as service from "./consent.service.js";

export const getByPatient = async ( req: Request, res: Response ) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({ message: "Unauthorized", });

    const patientId = String( req.params.patientId);

    const data = await service.getPatientConsents(
        patientId,
        user.clinicId,
        user.role
      );

    res.json(data);
  } catch (error: any) {
    console.error(error);

    res.status( error?.statusCode || 400 ).json({
      message: error?.message || "Failed to load consents", });
  }
};

export const create = async ( req: Request, res: Response ) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({ message: "Unauthorized", });

    const data = await service.registerConsent(
        {
          ...req.body,
          clinicId: user.clinicId,
          createdByStaffId:
            user.accountId,
        },
        user.clinicId,
        user.role
      );

    res.status(201).json(data);
  } catch (error: any) {
    console.error(error);

    res.status( error?.statusCode || 400 ).json({
      message:
        error?.message ||
        "Failed to create consent",
    });
  }
};

export const updateStatus = async ( req: Request, res: Response ) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({ message: "Unauthorized", });

    const id = String(req.params.id);
    const { status } = req.body;

    const data =
      await service.changeConsentStatus(
        id,
        status,
        user.clinicId,
        user.role
      );

    res.json(data);
  } catch (error: any) {
    console.error(error);

    res.status( error?.statusCode || 400 ).json({
      message: error?.message || "Failed to update consent",
    });
  }
};

export const remove = async ( req: Request, res: Response ) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({ message: "Unauthorized", });

    const id = String(req.params.id);

    await service.deleteConsent(
      id,
      user.clinicId,
      user.role
    );

    res.json({ message: "Consent deleted successfully", });
  } catch (error: any) {
    console.error(error);

    res.status( error?.statusCode || 400 ).json({
      message: error?.message || "Failed to delete consent",
    });
  }
};