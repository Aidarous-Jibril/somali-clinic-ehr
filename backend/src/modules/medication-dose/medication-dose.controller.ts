import { Request, Response } from "express";
import * as service from "./medication-dose.service.js";

export const createDose = async (
  req: Request,
  res: Response
) => {
  const medicationId = String(req.params.id);

  const dose = await service.createDose(
    medicationId,
    req.body
  );

  res.status(201).json(dose);
};

export const prepareDose = async (
  req: Request,
  res: Response
) => {
  const result = await service.prepareDose(
    String(req.params.doseId),
    req.user!.accountId,
    req.user!.clinicId
  );

  res.json(result);
};

export const administerDose = async (
  req: Request,
  res: Response
) => {
  const result = await service.administerDose(
    String(req.params.doseId),
    req.body,
    req.user!.accountId,
    req.user!.clinicId
  );

  res.json(result);
};

export const selfAdministerDose = async (
  req: Request,
  res: Response
) => {
  const result = await service.selfAdministerDose(
    String(req.params.doseId),
    req.user!.accountId,
    req.user!.clinicId
  );

  res.json(result);
};

export const skipDose = async (
  req: Request,
  res: Response
) => {
  const result = await service.skipDose(
    String(req.params.doseId),
    req.body,
    req.user!.accountId,
    req.user!.clinicId
  );

  res.json(result);
};

export const listAdministrations = async (
  req: Request,
  res: Response
) => {
  const medicationId = String(req.params.id);

  const rows =
    await service.listAdministrations(
      medicationId
    );

  const result = rows.map((row: any) => ({
    id: row.id,
    action: row.action,
    administeredDose: row.administeredDose,
    batchNumber: row.batchNumber,
    comment: row.comment,
    reason: row.reason,
    performedAt: row.performedAt,

    performedBy: row.performedByAccount
      ? `${row.performedByAccount.person.firstName} ${row.performedByAccount.person.lastName}`
      : null,

    doseLabel: row.dose?.label ?? null,
  }));

  res.json(result);
};