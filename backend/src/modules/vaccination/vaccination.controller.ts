import { Request, Response } from "express";
import * as service from "./vaccination.service.js";

export const createVaccination = async ( req: Request, res: Response ) => {
  const vacc = await service.createVaccination({
      ...req.body,

      clinicId: req.user!.clinicId,
      status: req.body.status ?? "active",
      administeredByAccountId: req.user!.accountId,
      administeredAt: req.body.administeredAt ? new Date( req.body.administeredAt ) : undefined, });

  return res.status(201).json(vacc);
};

export const listVaccinations = async ( req: Request, res: Response ) => {
    const vaccs = await service.listVaccinations(
        String(req.params.patientId),
        req.user!.clinicId
      );

    const result = vaccs.map(
      (v: any) => ({
        id: v.id,
        vaccineName: v.vaccineName,
        dose: v.dose,
        status: v.status,

        administeredAt:
          v.administeredAt,

        administeredBy:
          v.administeredByAccount
            ? `${v.administeredByAccount.person.firstName} ${v.administeredByAccount.person.lastName}`
            : null,
      })
    );

    res.json(result);
  };

export const declineVaccination = async ( req: Request, res: Response ) => {
    const vacc = await service.declineVaccination(
        String(req.params.id),
        req.user!.clinicId
      );

    res.json(vacc);
  };

export const completeVaccination = async ( req: Request, res: Response ) => {
    const vacc = await service.completeVaccination(
        String(req.params.id),
        req.user!.clinicId
      );

    res.json(vacc);
  };