import {
  findActiveContacts,
  updateBed,
  updatePlannedDischarge,
  findStayById,
  findCoordinationByStayId,
  upsertCoordination,
  createTransferReferral,
  findTransfers,
  updateReferralBed,
  completeTransfer,
  createStayFromReferral,
  closeStay,
  createAdmission,
  findReferralById,
} from "./inpatient.repository.js";

import { mapActiveContact } from "./inpatient.schema.js";

export const admitPatient = async (data: any) => {
  return createAdmission(data);
};

export const getActiveContacts = async ( clinicId: string ) => {
  const rows = await findActiveContacts(clinicId);

  return rows.map(mapActiveContact);
};

export const savePlannedDischarge = async ({
  stayId,
  clinicId,
  date,
  time,
  status,
}: {
  stayId: string;
  clinicId: string;
  date: string;
  time: string;
  status: string;
}) => {
  const stay = await findStayById(stayId, clinicId);

  if (!stay)  throw new Error("Stay not found");

  const plannedDischargeAt = new Date( `${date}T${time}:00` );

  return updatePlannedDischarge( stayId, plannedDischargeAt, status );
};

export const changeBed = async ({ stayId, clinicId, bedCode, }: { stayId: string; clinicId: string, bedCode: string; }) => {
  const stay = await findStayById(stayId, clinicId);

  if (!stay) throw new Error("Stay not found");
  

  return updateBed(stayId, bedCode);
};

export const getPatientLog = async ( stayId: string, clinicId: string ) => {
  const stay = await findStayById(stayId, clinicId);

  if (!stay) return [];
  
  const rows: any[] = [];

  rows.push({
    dateTime: stay.admittedAt.toISOString(),
    category: "Admission",
    text: `Admitted to ${
      stay.unit?.name ?? ""
    } / bed ${stay.bedCode}`,
    author: "System",
  });

  if (stay.plannedDischargeAt) {
    rows.push({
      dateTime:
        stay.plannedDischargeAt.toISOString(),
      category: "Planned discharge",
      text: `Status: ${stay.plannedDischargeStatus}`,
      author: "Staff",
    });
  }

  if (
    stay.encounter?.clinicalParameterEntries
      ?.length
  ) {
    for (const entry of stay.encounter
      .clinicalParameterEntries) {
      rows.push({
        dateTime:
          entry.recordedAt.toISOString(),
        category: entry.name,
        text: `${entry.name} = ${entry.value}`,
        author:
          entry.recordedByAccountId ??
          "Unknown",
      });
    }
  }

  return rows.sort( (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime() );
};

export const getCoordination = async ( stayId: string ) => {
  const row = await findCoordinationByStayId(stayId);

  const defaultCoordination = {
    infoSharingConsent: "notAsked",
    coordinationNeeded: "notAsked",
    sipConsent: "notAsked",
    adminComment: "",
    recipients: [],
  };

  if (!row) return defaultCoordination;

  return {
    infoSharingConsent:
      row.infoSharingConsent,
    coordinationNeeded:
      row.coordinationNeeded,
    sipConsent: row.sipConsent,
    adminComment:
      row.adminComment ?? "",
    recipients: Array.isArray(
      row.recipients
    )
      ? row.recipients
      : [],
  };
};

export const saveCoordination = async ({ stayId, clinicId, data, }: { stayId: string; clinicId: string; data: any; }) => {
  const stay = await findStayById(stayId, clinicId);

  if (!stay)  throw new Error("Stay not found");
  

  const recipients = Array.isArray(
    data.recipients
  )
    ? data.recipients.map((r: any) => ({
        type: String(r.type || ""),
        unit: String(r.unit || ""),
      }))
    : [];

  return upsertCoordination(stayId, {
    infoSharingConsent: String(
      data.infoSharingConsent ||
        "notAsked"
    ),
    coordinationNeeded: String(
      data.coordinationNeeded ||
        "notAsked"
    ),
    sipConsent: String(
      data.sipConsent || "notAsked"
    ),
    adminComment: String(
      data.adminComment || ""
    ),
    recipients,
  });
};

export const planTransfer = async ( data: any,  ) => {
  const stay = await findStayById( data.stayId, data.clinicId );

  if (!stay) throw new Error("Stay not found");
  

  const plannedAt = new Date( `${data.transferDate}T${data.transferTime}:00` );

  return createTransferReferral({
    clinicId: data.clinicId,
    patientId: stay.patientId,
    encounterId:
      stay.encounterId ?? undefined,
    fromUnitId:
      stay.unitId ?? undefined,

    sentByAccountId:
      data.accountId,

    toUnitName: data.toUnit,
    reason: data.reason,
    plannedAt,

    technicalUnit:
      data.technicalUnit,
    specialBedNeeds:
      data.specialBedNeeds,

    transferDecided:
      Boolean(data.transferDecided),

    patientReady:
      Boolean(data.patientReady),
  });
};

export const getTransfers = async ( clinicId: string, unitId?: string ) => {
  return findTransfers( clinicId, unitId );
};

export const reserveBed = async ( referralId: string, bedCode: string ) => {
  return updateReferralBed( referralId, bedCode);
};

export const transferNow = async (referralId: string) => {
  const existing = await findReferralById(referralId);

  if (!existing) throw new Error("Referral not found");

  if (existing.status === "completed") 
    throw new Error("Transfer already completed");

  const referral = await completeTransfer(referralId);
  return createStayFromReferral(referral);
};

export const endCareContact = async ( stayId: string, clinicId: string ) => {
  const stay = await findStayById(stayId, clinicId);

  if (!stay) throw new Error("Stay not found");

  return closeStay(stayId);
};