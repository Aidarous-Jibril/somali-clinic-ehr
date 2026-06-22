import { prisma } from "../../config/prisma.js";
import * as repo from "./sampling.repository.js";

/* =========================
   CREATE SAMPLE
========================= */

export const createSampleService = async (data: any) => {
  const order = await prisma.order.findUnique({
    where: { id: data.orderId, },
  });

  if (!order) throw new Error("Order not found");

  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId, },
  });

  if (!patient) throw new Error("Patient not found");
  
  const existing = await repo.findSampleByOrderId(data.orderId);

  if (existing && ["registered","collected","received","processing"].includes(existing.status)) 
    throw new Error("Active sample already exists for this order");

  const sample = await repo.createSample(data);

  await repo.createTrackingEvent({
    sampleId: sample.id,
    type: "registered",
    details: "Sample registered",
  });

  return repo.getSampleById(sample.id);
};

/* =========================
   GETTERS
========================= */
export const getSampleByIdService = ( id: string ) => {
  return repo.getSampleById(id);
};

export const getSamplesByOrderIdService = ( orderId: string ) => {
  return repo.getSamplesByOrderId(orderId);
};

export const getAllSamplesService = (clinicId: string) => {
  return repo.getAllSamples(clinicId);
};

/* =========================
   COLLECT SAMPLE
========================= */
export const collectSampleService = async ( sampleId: string, accountId: string, notes?: string ) => {
  const current = await repo.getSampleById(sampleId);

  if (!current) throw new Error("Sample not found");

  if (current.status !== "registered") 
    throw new Error("Sample must be registered first");

  const sample = await repo.updateSample(sampleId, {
    status: "collected",
    collectedAt: new Date(),
    collectedByAccountId: accountId,
    notes,
  });

  await prisma.order.update({
    where: { id: sample.orderId },
    data: { status: "in_progress" },
  });

  await repo.createTrackingEvent({
    sampleId,
    type: "collected",
    performedByAccountId: accountId,
    details: notes || "Sample collected",
  });

  return repo.getSampleById(sampleId);
};

/* =========================
   RECEIVE SAMPLE
========================= */
export const receiveSampleService = async ( sampleId: string, accountId: string ) => {
  const current = await repo.getSampleById(sampleId);

  if (!current) throw new Error("Sample not found");

  if (current.status !== "collected") 
    throw new Error("Sample must be collected first");

  await repo.updateSample(sampleId, {
    status: "received",
    receivedAt: new Date(),
    receivedByAccountId: accountId,
  });

  await repo.createTrackingEvent({
    sampleId,
    type: "received",
    performedByAccountId: accountId,
    details: "Sample received in laboratory",
  });

  return repo.getSampleById(sampleId);
};

/* =========================
   PROCESS SAMPLE
========================= */
export const processSampleService = async ( sampleId: string, accountId: string ) => {
  const current = await repo.getSampleById(sampleId);

  if (!current) throw new Error("Sample not found");

  if (current.status !== "received") 
    throw new Error("Sample must be received first");

  await repo.updateSample(sampleId, {
    status: "processing",
    processedAt: new Date(),
    processedByAccountId: accountId,
  });

  await repo.createTrackingEvent({
    sampleId,
    type: "processing",
    performedByAccountId: accountId,
    details: "Sample processing started",
  });

  return repo.getSampleById(sampleId);
};

/* =========================
   COMPLETE SAMPLE
========================= */
export const completeSampleService = async ( sampleId: string, accountId: string ) => {
  const current = await repo.getSampleById(sampleId);

  if (!current) throw new Error("Sample not found");

  if (current.status !== "processing") 
    throw new Error("Sample must be processing first");

  const sample = await repo.updateSample(sampleId, {
    status: "completed",
    completedAt: new Date(),
  });

  await prisma.order.update({
    where: { id: sample.orderId },
    data: {
      status: "awaiting_result",
    },
  });

  await repo.createTrackingEvent({
    sampleId,
    type: "completed",
    performedByAccountId: accountId,
    details: "Sample completed",
  });

  return repo.getSampleById(sampleId);
};

/* =========================
   REJECT SAMPLE
========================= */
export const rejectSampleService = async ( sampleId: string, accountId: string, reason?: string ) => {
  const current = await repo.getSampleById(sampleId);

  if (!current) throw new Error("Sample not found");

  if (["completed", "rejected"].includes(current.status)) 
    throw new Error("Sample can no longer be rejected");

  const sample = await repo.updateSample(sampleId, {
    status: "rejected",
  });

  await prisma.order.update({
    where: { id: sample.orderId },
    data: {
      status: "cancelled",
      cancelledAt: new Date(),
    },
  });

  await repo.createTrackingEvent({
    sampleId,
    type: "rejected",
    performedByAccountId: accountId,
    details: reason || "Sample rejected",
  });

  return repo.getSampleById(sampleId);
};

export const getSampleByIdForClinicService = ( id: string, clinicId: string ) => {
  return repo.getSampleByIdForClinic(id, clinicId);
};