export type SamplingPriority = "Routine" | "Urgent" | "Stat";

export type TubeGroup = {
  id: string;
  label: string; // e.g. "EDTA K2 5 mL (Purple/Black)"
  analyses: string[];
};

export type SamplingWorklistItem = {
  id: string;

  // Worklist table (left)
  dateTime: string; // e.g. "2021-03-17 11:10"
  personId: string; // e.g. "19 400133-0002"
  patientName: string; // e.g. "Alice Fast"
  specialty: string; // e.g. "Clinical chemistry"
  rid: string; // e.g. "80000857"

  // Filtering / admin (right)
  orderingUnit: string; // e.g. "Medical ward 1"
  requester: string; // e.g. "Johan Svärd, MD"
  responseRecipient: string;
  responseRecipientUnit: string;
  payingUnit: string;
  orderIdentity: string;

  plannedSamplingDate: string; // "2021-03-17"
  plannedSamplingTime: string; // "11:10"
  samplingDate: string; // "2021-03-17"
  samplingTime: string; // "11:13"

  priority: SamplingPriority;

  // Content (middle)
  tubeGroups: TubeGroup[];

  // State flags
  printed: boolean;
  sent: boolean;

  // Comments
  samplerComment?: string;
  requesterComment?: string;
};
