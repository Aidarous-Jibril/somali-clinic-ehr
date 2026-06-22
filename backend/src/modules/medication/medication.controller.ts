import { Request, Response } from "express";
import * as service from "./medication.service.js";


export const createMedication = async ( req: Request, res: Response ) => {
  try {
    const med = await service.createMedication({
      ...req.body,
      clinicId: req.user!.clinicId,
      prescribedByAccountId: req.user!.accountId,
    });

    return res.status(201).json({ message: "Medication registered successfully", data: med, });
  } catch (error: any) {
    console.error(error);

    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to create medication", });
  }
};

export const listMedications = async (req: Request, res: Response) => {
  try {
    const meds = await service.listMedications( String(req.params.patientId), req.user!.clinicId );
  
    const result = meds.map((m: any) => ({
      id: m.id,
  
      // Basic fields
      name: m.name,
      strength: m.strength,
      form: m.form,
      dose: m.dose,
      frequency: m.frequency,
  
      // Additional fields
      dosingText: m.dosingText,
      indication: m.indication,
      groupType: m.groupType,
      route: m.route,
      notes: m.notes,
  
      // Metadata
      status: m.status,
      startDate: m.startDate,
      endDate: m.endDate,
      createdAt: m.createdAt,
  
      // Prescriber
      prescribedBy: m.prescribedByAccount
        ? `${m.prescribedByAccount.person.firstName} ${m.prescribedByAccount.person.lastName}`
        : null,
  
      // Scheduled doses
      doses: (m.scheduledDoses ?? []).map((d: any) => ({
        id: d.id,
        label: d.label,
        scheduledDate: d.scheduledDate,
        status: d.status,
        tooltip: d.tooltip,
        isPrn: d.isPrn,
      })),
    }));
  
    res.json(result);
  } catch (error: any) {
     console.error(error);

    return res.status(error?.statusCode || 500).json({
      message: error?.message || "Failed to fetch medications",
    });
  }
};

export const stopMedication = async (req: Request, res: Response) => {
  try {
    const medId = String(req.params.id);
    const med = await service.stopMedication(medId, req.user!.clinicId);
    res.json(med);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to stop medication", });
  }
};

export const pauseMedication = async (req: Request, res: Response) => {
  try {
    const medId = String(req.params.id);
    const med = await service.pauseMedication(medId, req.user!.clinicId);
    res.json(med);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to pause medication", });
  }
};

export const resumeMedication = async (req: Request, res: Response) => {
  try {
    const medId = String(req.params.id);
    const med = await service.resumeMedication(medId, req.user!.clinicId);
    res.json(med);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to resume medication", });
  }
};

export const listFavorites = async ( req: Request, res: Response ) => {
  try {
    const medications = await service.listFavorites();
  
    const result = medications.map((m: any) => ({
      id: m.id,
  
      // Favorite template fields used by frontend
      treatmentReason: m.indication || "",
      templateName: `${m.name}${m.strength ? ` ${m.strength}` : ""}`,
      product: m.name,
      form: m.form || "",
      strength: m.strength || "",
      dosing: m.dosingText || m.dose,
      recommended: true,
  
      // Extra fields needed when signing
      name: m.name,
      dose: m.dose,
      frequency: m.frequency,
      groupType: m.groupType,
      dosingText: m.dosingText,
      indication: m.indication,
      strengthValue: m.strength,
      formValue: m.form,
      route: m.route,
      notes: m.notes,
    }));
  
    res.json(result);
  } catch (error: any) {
    return res.status(error?.statusCode || 500).json({ message: error?.message || "Failed to fetch favorite medications", });
  }
};