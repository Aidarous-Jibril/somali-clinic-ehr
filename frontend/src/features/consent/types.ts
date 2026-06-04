export type ConsentStatus =
  | "active"
  | "ended"
  | "upcoming"
  | "cancelled";

export type ConsentTypeKey = "shared_healthrecord";

export type ConsentRecord = {
  id: string;
  clinicId: string;
  patientId: string;

  type: ConsentTypeKey;
  title: string;
  organizationLine: string;

  startDate: string;
  endDate: string;

  status: ConsentStatus;
  createdAt?: string;
};

export type CreateConsentPayload = {
  clinicId: string;
  patientId: string;
  type: ConsentTypeKey;
  title: string;
  organizationLine: string;
  startDate: string;
  endDate: string;
};

export type UpdateConsentStatusPayload = {
  status: ConsentStatus;
};