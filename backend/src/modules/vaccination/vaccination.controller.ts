import { Request, Response } from "express";
import * as service from "./vaccination.service.js";

export const createVaccination = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const vacc = await service.createVaccination({
      ...req.body,
      clinicId: user.clinicId,
      status: req.body.status ?? "active",
      administeredByAccountId: user.accountId,
      administeredAt: req.body.administeredAt
        ? new Date(req.body.administeredAt)
        : undefined,
    });

    res.status(201).json(vacc);
  } catch (error: any) {
    console.error(error);

    res.status(error?.statusCode || 400).json({
      message:
        error?.message ||
        "Failed to create vaccination",
    });
  }
};

export const listVaccinations = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const clinicId =
      user.role === "SuperAdmin"
        ? undefined
        : user.clinicId;

    const vaccs =
      await service.listVaccinations(
        String(req.params.patientId),
        clinicId
      );

    const result = vaccs.map((v: any) => ({
      id: v.id,
      vaccineName: v.vaccineName,
      dose: v.dose,
      status: v.status,
      administeredAt: v.administeredAt,
      administeredBy: v.administeredByAccount
        ? `${v.administeredByAccount.person.firstName} ${v.administeredByAccount.person.lastName}`
        : null,
    }));

    res.json(result);
  } catch (error: any) {
    console.error(error);

    res.status(error?.statusCode || 400).json({
      message:
        error?.message ||
        "Failed to fetch vaccinations",
    });
  }
};

export const declineVaccination = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const clinicId =
      user.role === "SuperAdmin"
        ? undefined
        : user.clinicId;

    const vacc =
      await service.declineVaccination(
        String(req.params.id),
        clinicId
      );

    res.json(vacc);
  } catch (error: any) {
    console.error(error);

    res.status(error?.statusCode || 400).json({
      message:
        error?.message ||
        "Failed to decline vaccination",
    });
  }
};

export const completeVaccination = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const clinicId =
      user.role === "SuperAdmin"
        ? undefined
        : user.clinicId;

    const vacc =
      await service.completeVaccination(
        String(req.params.id),
        clinicId
      );

    res.json(vacc);
  } catch (error: any) {
    console.error(error);

    res.status(error?.statusCode || 400).json({
      message:
        error?.message ||
        "Failed to complete vaccination",
    });
  }
};