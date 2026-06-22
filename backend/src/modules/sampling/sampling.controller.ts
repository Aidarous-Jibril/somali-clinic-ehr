import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import * as service from "./sampling.service.js";
import { toSamplingWorklistItem } from "./sampling.mapper.js";

/* =========================
   CREATE
========================= */
export const createSampleController = async ( req: Request, res: Response ) => {
  try {
    const sample = await service.createSampleService(req.body);

    return res.status(201).json(sample);
  } catch (error: any) {
     console.error(error);

  if (error.message === "Order not found")
    return res.status(404).json({ message: error.message });

  if (error.message === "Patient not found")
    return res.status(404).json({ message: error.message });

  if (error.message === "Active sample already exists for this order")
    return res.status(409).json({ message: error.message });

  return res.status(500).json({
    message: "Internal server error",
  });
  }
};


/* =========================
   GETTERS
========================= */
export const getAllSamplesController = async ( req: Request, res: Response ) => {
  try {
    const samples = await service.getAllSamplesService( req.user!.clinicId );

    const mapped = samples.map( toSamplingWorklistItem);

    return res.json(mapped);
  } catch (error: any) {
    console.error(error);
    
    return res.status(500).json({ message: error.message, }); 
  }
};


export const getSampleByIdController = async ( req: Request, res: Response ) => {
  try {
   const sample = await service.getSampleByIdForClinicService( String(req.params.id), req.user!.clinicId );

    if (!sample)  return res.status(404).json({ message: "Sample not found", });
    
    return res.json(sample);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({ message: error.message, }); 
  }
};

export const getSamplesByOrderIdController = async ( req: Request, res: Response ) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: String(req.params.orderId),
        clinicId: req.user!.clinicId,
      },
    });

    if (!order)  return res.status(404).json({ message: "Order not found",});

    const samples = await service.getSamplesByOrderIdService( String(req.params.orderId) );

    return res.json(samples);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({ message: error.message, }); 
  }
};

/* =========================
   COLLECT
========================= */
export const collectSampleController = async ( req: Request, res: Response ) => {
  try {
    
    const sample = await service.getSampleByIdForClinicService(
      String(req.params.id),
      req.user!.clinicId
    );

    if (!sample) return res.status(404).json({ message: "Sample not found", });
    
    const updated =  await service.collectSampleService( sample.id,  req.user!.accountId, req.body.notes );

    return res.json(updated);
  } catch (error: any) {
    console.error(error);

     return res.status(500).json({ message: error.message, }); 
  }
};

/* =========================
   RECEIVE
========================= */
export const receiveSampleController = async ( req: Request, res: Response ) => {
  try {
   const sample = await service.getSampleByIdForClinicService( String(req.params.id), req.user!.clinicId );

    if (!sample)  return res.status(404).json({ message: "Sample not found", });

    const updated =  await service.receiveSampleService( sample.id, req.user!.accountId );

    return res.json(updated);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({ message: error.message, }); 
  }
};

/* =========================
   PROCESS
========================= */
export const processSampleController = async ( req: Request, res: Response ) => {
  try {
   const sample = await service.getSampleByIdForClinicService( String(req.params.id), req.user!.clinicId );

    if (!sample) return res.status(404).json({ message: "Sample not found", });

    const updated =  await service.processSampleService( sample.id, req.user!.accountId );

    return res.json(updated);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({ message: error.message, }); 
  }
};

/* =========================
   COMPLETE
========================= */
export const completeSampleController = async ( req: Request, res: Response ) => {
  try {
   const sample = await service.getSampleByIdForClinicService( String(req.params.id), req.user!.clinicId );

    if (!sample)  return res.status(404).json({ message: "Sample not found", });

    const updated = await service.completeSampleService( sample.id, req.user!.accountId );

    return res.json(updated);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({ message: error.message, }); 
  }
};

/* =========================
   REJECT
========================= */
export const rejectSampleController = async ( req: Request, res: Response ) => {
  try {
   const sample = await service.getSampleByIdForClinicService( String(req.params.id), req.user!.clinicId);
   
    if (!sample) return res.status(404).json({ message: "Sample not found",});

    const updated = await service.rejectSampleService( sample.id, req.user!.accountId, req.body.reason);

    return res.json(updated);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({ message: error.message, }); 
  }
};