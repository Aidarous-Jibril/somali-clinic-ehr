import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import * as service from "./samples.service.js";
import { toSamplingWorklistItem } from "./sampling.mapper.js";

/* =========================
   CREATE
========================= */
export const createSampleController = async ( req: Request, res: Response ) => {
  try {
    const sample = await service.createSampleService(req.body);

    return res.status(201).json(sample);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create sample",
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch samples",
    });
  }
};


export const getSampleByIdController = async ( req: Request, res: Response ) => {
  try {
    const sample = await service.getSampleByIdService( String(req.params.id) );

    if (!sample)  return res.status(404).json({ message: "Sample not found", });
    
    return res.json(sample);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch sample",
    });
  }
};

export const getSamplesByOrderIdController = async ( req: Request, res: Response ) => {
  try {
    const samples = await service.getSamplesByOrderIdService( String(req.params.orderId) );

    return res.json(samples);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch samples",
    });
  }
};

/* =========================
   COLLECT
========================= */
export const collectSampleController = async ( req: Request, res: Response ) => {
  try {
    
    const sample = await prisma.sample.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!sample) return res.status(404).json({ message: "Sample not found", });
    if (sample.status !== "registered")  return res.status(400).json({ message: "Sample must be registered first",});
    
    const updated =  await service.collectSampleService( sample.id,  req.user!.accountId, req.body.notes );

    return res.json(updated);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to collect sample",
    });
  }
};

/* =========================
   RECEIVE
========================= */
export const receiveSampleController = async ( req: Request, res: Response ) => {
  try {
    const sample = await prisma.sample.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!sample)  return res.status(404).json({ message: "Sample not found", });

    if (sample.status !== "collected") return res.status(400).json({ message: "Sample must be collected first", });

    const updated =  await service.receiveSampleService( sample.id, req.user!.accountId );

    return res.json(updated);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to receive sample",
    });
  }
};

/* =========================
   PROCESS
========================= */
export const processSampleController = async ( req: Request, res: Response ) => {
  try {
    const sample = await prisma.sample.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!sample) return res.status(404).json({ message: "Sample not found", });

    if (sample.status !== "received")  return res.status(400).json({ message: "Sample must be received first", });

    const updated =  await service.processSampleService( sample.id, req.user!.accountId );

    return res.json(updated);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to process sample",
    });
  }
};

/* =========================
   COMPLETE
========================= */
export const completeSampleController = async ( req: Request, res: Response ) => {
  try {
    const sample = await prisma.sample.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!sample) return res.status(404).json({ message: "Sample not found", });
    if (sample.status !== "processing")  return res.status(400).json({ message: "Sample must be processing first", });

    const updated = await service.completeSampleService( sample.id, req.user!.accountId );

    return res.json(updated);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to complete sample",
    });
  }
};

/* =========================
   REJECT
========================= */
export const rejectSampleController = async ( req: Request, res: Response ) => {
  try {
    const sample = await prisma.sample.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!sample) return res.status(404).json({ message: "Sample not found",});
    if ( ["completed", "rejected"].includes(sample.status) ) return res.status(400).json({ message: "Sample can no longer be rejected", });

    const updated = await service.rejectSampleService( sample.id, req.user!.accountId, req.body.reason);

    return res.json(updated);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to reject sample",
    });
  }
};