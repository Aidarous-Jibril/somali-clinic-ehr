import { Request, Response } from "express";
import {
  changeBed,
  getActiveContacts,
  savePlannedDischarge,
  getPatientLog,
  getCoordination,
  saveCoordination,
  planTransfer,
  getTransfers,
  reserveBed,
  transferNow,
  endCareContact,
  admitPatient,
} from "./inpatient.service.js";

export const admitPatientHandler = async ( req: Request, res: Response ) => {
  try {
    const result = await admitPatient({
      ...req.body,
      clinicId: req.user!.clinicId,
      accountId: req.user!.accountId,
    });

    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, });
  }
};

export const getActiveContactsHandler = async ( req: Request, res: Response ) => {
  try {
    const data = await getActiveContacts( req.user!.clinicId);

    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message, });
  }
};

export const savePlannedDischargeHandler = async ( req: Request, res: Response ) => {
  try {
    const { stayId, date, time, status } = req.body;

    if (!stayId || !date || !time || !status) 
      return res.status(400).json({ message: "Missing fields", });

    const result = await savePlannedDischarge({ stayId, clinicId: req.user!.clinicId, date, time, status,});

    res.json(result);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });
  }
};

export const changeBedHandler = async ( req: Request, res: Response ) => {
  try {
    const { stayId, bedCode } = req.body;

    if (!stayId || !bedCode) 
      return res.status(400).json({ message: "Missing fields",  });

    const result = await changeBed({ stayId, clinicId: req.user!.clinicId, bedCode,});

    res.json(result);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });
  }
};

export const getPatientLogHandler = async ( req: Request, res: Response ) => {
  try {
    const stayId = String(req.params.stayId);

    res.json(await getPatientLog(stayId, req.user!.clinicId));
  } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message, });
  }
};

export const getCoordinationHandler = async ( req: Request, res: Response ) => {
  try {
    const stayId = String(req.params.stayId);

    res.json(await getCoordination(stayId));
  } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message, });
  }
};

export const saveCoordinationHandler = async ( req: Request, res: Response) => {
  try {
    const { stayId, ...data } = req.body;

    if (!stayId) 
      return res.status(400).json({ message: "stayId is required", });

    const result = await saveCoordination({ stayId, clinicId: req.user!.clinicId, data,});

    res.json(result);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });
  }
};

export const planTransferHandler = async ( req: Request, res: Response ) => {
  try {
    const result = await planTransfer({
      ...req.body,
      clinicId: req.user!.clinicId,
      accountId: req.user!.accountId,
    });

    res.json(result);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });
  }
};

export const getTransfersHandler = async ( req: Request, res: Response ) => {
  try {
    const data = await getTransfers(
      req.user!.clinicId,
      req.user!.unitId || undefined
    );

    res.json(data);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });
  }
};

export const reserveBedHandler = async ( req: Request, res: Response ) => {
  try {
    const { referralId, bedCode } = req.body;

    const result = await reserveBed( referralId, bedCode );

    res.json(result);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });
  }
};

export const transferNowHandler = async ( req: Request, res: Response ) => {
  try {
    const { referralId } = req.body;

    const result = await transferNow(referralId);

    res.json(result);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });
  }
};

export const endCareContactHandler = async ( req: Request, res: Response ) => {
  try {
    const { stayId } = req.body;

    if (!stayId) 
      return res.status(400).json({ message: "stayId is required", });

    const result = await endCareContact(stayId, req.user!.clinicId);

    res.json(result);
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message, });
  }
};