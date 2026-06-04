export type SamplingPriority = "Routine" | "Urgent" | "Stat";

export type TubeGroup = {
  id: string;
  label: string; // e.g. "EDTA K2 5 mL (Purple/Black)"
  analyses: string[];
};

export type SamplingStatus =
  | "registered"
  | "collected"
  | "received"
  | "processing"
  | "completed"
  | "rejected";
  
  export type SamplingWorklistItem = {
  id: string;

  patientId: string;

  patientName: string;

  personId: string;

  dateTime: string;

  specialty: string;

  rid: string;

  orderId: string;

  orderingUnit: string;

  requester: string;

  responseRecipient: string;

  responseRecipientUnit: string;

  payingUnit: string;

  orderIdentity: string;

  plannedSamplingDate: string;

  plannedSamplingTime: string;

  samplingDate: string;

  samplingTime: string;

  priority: SamplingPriority;

  status: SamplingStatus;

  sampleType: string;

  barcode?: string;

  collectedAt?: string;

  receivedAt?: string;

  processedAt?: string;

  tubeGroups: TubeGroup[];

  printed: boolean;

  sent: boolean;

  samplerComment?: string;

  requesterComment?: string;
};