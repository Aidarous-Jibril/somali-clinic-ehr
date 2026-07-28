export type LaboratoryAnalysis = {
  id: string;
  analysis: string;
  code: string;
  category: string;
  status: string;
};

export type LaboratorySample = {
  id: string;
  status: string;
  sampleType: string;
  barcode?: string;

  collectedAt?: string;
  receivedAt?: string;
  processedAt?: string;
  completedAt?: string;

  notes?: string;
};

export type LaboratoryWorklistItem = {
  id: string;
  orderId: string;

  patientId: string;
  patientName: string;
  personId: string;

  analysis: string;
  code: string;
  category: string;

  status: string;

  orderingUnit: string;
  requester: string;

  orderedAt: string;

  sample?: LaboratorySample;

  analyses: LaboratoryAnalysis[];
};