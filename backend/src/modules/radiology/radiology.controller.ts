//radiology.controller.ts
import { Request, Response } from "express";
import * as service from "./radiology.service.js";

export const submitRadiologyReportController = async ( req: Request, res: Response ) => {
  try {
    const report = await service.submitRadiologyReportService({
      orderId: String(req.params.id),
      clinicId: req.user!.clinicId,
      accountId: req.user!.accountId,

      impression: req.body.impression,
      findings: req.body.findings,
      overallResult: req.body.overallResult,
      comment: req.body.comment,

      files: req.files as Express.Multer.File[],
    });

    return res.status(201).json(report);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const listRadiologyResultsByPatientController = async ( req: Request, res: Response ) => {
  try {
    const results =
      await service.listRadiologyResultsByPatientService( String(req.params.patientId), req.user!.clinicId );

    return res.json(results);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};