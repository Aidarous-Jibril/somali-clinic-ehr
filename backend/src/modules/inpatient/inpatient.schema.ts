export type ActiveContactDto = {
  id: string;
  patientId?: string;
  encounterId?: string | null;
  bed: string;
  nationalId: string;
  name: string;
  ews?: number;
  ward: string;
  startDate: string;
  technicalUnit: string;
  team: string;
  absence: string;
  activity: string;
  plannedTransfer?: { dateTime?: string | null; unit: string; };
  plannedDischarge?: { dateTime: string; status: string; };
};

export const mapActiveContact = (stay: any): ActiveContactDto => {
  const news =
    stay.encounter?.clinicalParameterEntries?.[0];

  const referral = stay.transferReferral;

  let plannedTransfer;

  if (referral) {
    const details = JSON.parse(referral.details || "{}");

    plannedTransfer = {
      dateTime: details?.plannedAt || null,
      unit: referral.toUnit?.name || "",
    };
  }

  return {
    id: stay.id,
    patientId: stay.patient.id,
    encounterId: stay.encounterId,
    bed: stay.bedCode,
    nationalId: stay.patient.nationalId ?? "",
    name: `${stay.patient.firstName} ${stay.patient.lastName}`,
    ews: news ? Number(news.value) : stay.ews ?? undefined,
    ward: stay.unit?.name ?? "",
    startDate: stay.admittedAt.toISOString(),
    team: stay.team ?? "",
    technicalUnit: stay.technicalUnit ?? "",
    absence: stay.absence ?? "",
    activity: stay.activity ?? "",
    plannedTransfer,

    plannedDischarge: stay.plannedDischargeAt ? { dateTime: stay.plannedDischargeAt.toISOString(), status: stay.plannedDischargeStatus ?? "notEvaluated", } : undefined,
  };
};