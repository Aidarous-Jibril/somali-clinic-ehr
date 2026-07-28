// src/features/radiology/types.ts

export type RadiologyWorklistItem = {
  id: string;
  orderId: string;

  patientId: string;
  patientName: string;
  personId: string;

  examination: string;
  modality: string;

  requester: string;
  orderingUnit: string;

  orderedAt: string;
  resultedAt?: string;
  reviewedAt?: string;

  status: string;

  impression?: string;
  findings?: string;
  result?: string;
};