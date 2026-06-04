import { prisma } from "../../config/prisma.js";
import * as repo from "./sampling.repository.js";

/* =========================
   CREATE SAMPLE
========================= */

export const createSampleService = async (data: any) => {
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
  const sample = await repo.updateSample(sampleId, {
    status: "collected",
    collectedAt: new Date(),
    collectedByAccountId: accountId,
    notes,
  });

  // ORDER → IN PROGRESS
  await prisma.order.update({
    where: {
      id: sample.orderId,
    },

    data: {
      status: "in_progress",
    },
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
  await repo.updateSample(sampleId, {
    status: "received",
    receivedAt: new Date(),
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
export const processSampleService = async ( sampleId: string, accountId: string ) => {
  await repo.updateSample(sampleId, {
    status: "processing",
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
  const sample = await repo.updateSample(sampleId, {
    status: "completed",
    processedAt: new Date(),
    processedByAccountId: accountId,
  });

  // ORDER → RESULTED
  await prisma.order.update({
    where: {
      id: sample.orderId,
    },

    data: {
      status: "awaiting_result",
      // resultedAt: new Date(),
      // resultedByAccountId: accountId,
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
  const sample = await repo.updateSample(sampleId, {
    status: "rejected",
  });

  // ORDER → CANCELLED
  await prisma.order.update({
    where: {
      id: sample.orderId,
    },

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