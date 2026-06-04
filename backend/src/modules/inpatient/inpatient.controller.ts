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

export const admitPatientHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await admitPatient({
      ...req.body,
      clinicId: req.user!.clinicId,
      accountId: req.user!.accountId,
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to admit patient",
    });
  }
};

export const getActiveContactsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await getActiveContacts(
      req.user!.clinicId
    );

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch active contacts",
    });
  }
};

export const savePlannedDischargeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { stayId, date, time, status } = req.body;

    if (!stayId || !date || !time || !status) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const result = await savePlannedDischarge({
      stayId,
      date,
      time,
      status,
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save planned discharge",
    });
  }
};

export const changeBedHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { stayId, bedCode } = req.body;

    if (!stayId || !bedCode) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const result = await changeBed({
      stayId,
      bedCode,
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to change bed",
    });
  }
};

export const getPatientLogHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const stayId = String(req.params.stayId);

    res.json(await getPatientLog(stayId));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load patient log",
    });
  }
};

export const getCoordinationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const stayId = String(req.params.stayId);

    res.json(await getCoordination(stayId));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load coordination",
    });
  }
};

export const saveCoordinationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { stayId, ...data } = req.body;

    if (!stayId) {
      return res.status(400).json({
        message: "stayId is required",
      });
    }

    const result = await saveCoordination({
      stayId,
      data,
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save coordination",
    });
  }
};

export const planTransferHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await planTransfer({
      ...req.body,
      clinicId: req.user!.clinicId,
      accountId: req.user!.accountId,
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to plan transfer",
    });
  }
};

export const getTransfersHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await getTransfers(
      req.user!.clinicId,
      req.user!.unitId || undefined
    );

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load transfers",
    });
  }
};

export const reserveBedHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { referralId, bedCode } = req.body;

    const result = await reserveBed(
      referralId,
      bedCode
    );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to reserve bed",
    });
  }
};

export const transferNowHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { referralId } = req.body;

    const result = await transferNow(referralId);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to transfer patient",
    });
  }
};

export const endCareContactHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { stayId } = req.body;

    if (!stayId) {
      return res.status(400).json({
        message: "stayId is required",
      });
    }

    const result = await endCareContact(stayId);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to end care contact",
    });
  }
};