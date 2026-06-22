import { Roles } from "../../constants/roles.js";

import {
  createConsent,
  findActiveConsent,
  findConsentById,
  findPatientById,
  getConsentsByPatient,
  remove,
  updateConsentStatus,
} from "./consent.repository.js";

const toUiStatus = (status: string) => {
  switch (status) {
    case "active":
      return "Active";

    case "ended":
      return "Ended";

    case "upcoming":
      return "Upcoming";

    case "cancelled":
      return "Cancelled";

    default:
      return "Active";
  }
};

const mapConsent = (consent: any) => ({
  id: consent.id,
  type: consent.type,
  title: consent.title,
  organizationLine: consent.organizationLine,
  startDate: consent.startDate
    .toISOString()
    .slice(0, 10),
  endDate: consent.endDate
    .toISOString()
    .slice(0, 10),
  status: toUiStatus(consent.status),
});

export const getPatientConsents = async ( patientId: string, clinicId: string, role: string ) => {
  const patient = await findPatientById(patientId);

  if (!patient) 
    throw { statusCode: 404, message: "Patient not found",};

  if ( role !== Roles.SuperAdmin && patient.clinicId !== clinicId) 
    throw { statusCode: 404, message: "Patient not found", };

  const rows = await getConsentsByPatient( patientId );

  return rows.map(mapConsent);
};

export const registerConsent = async ( data: any, clinicId: string, role: string ) => {
  const patient = await findPatientById( data.patientId );

  if (!patient)
    throw { statusCode: 404, message: "Patient not found", };

  if ( role !== Roles.SuperAdmin && patient.clinicId !== clinicId )
    throw { statusCode: 404, message: "Patient not found", };

  const existing = await findActiveConsent( data.patientId, data.type);

  if (existing)
    throw { statusCode: 409, message: "Active consent already exists for this type",};

  if ( new Date(data.endDate) < new Date(data.startDate) )
    throw { statusCode: 400, message: "End date cannot be before start date",};

  const consent = await createConsent(data);

  return mapConsent(consent);
};

export const changeConsentStatus = async ( id: string, status: string, clinicId: string, role: string
) => {
  const consent = await findConsentById( id, role === Roles.SuperAdmin ? undefined : clinicId);

  if (!consent) 
    throw { statusCode: 404, message: "Consent not found", };

  if ( role !== Roles.SuperAdmin && consent.clinicId !== clinicId ) 
    throw { statusCode: 404, message: "Consent not found", };
  
  const updated = await updateConsentStatus( id, status );

  return mapConsent(updated);
};

export const deleteConsent = async ( id: string, clinicId: string, role: string ) => {
  const consent = await findConsentById( id, role === Roles.SuperAdmin ? undefined : clinicId );

  if (!consent) 
    throw { statusCode: 404, message: "Consent not found",};

  if ( role !== Roles.SuperAdmin && consent.clinicId !== clinicId) 
    throw { statusCode: 404, message: "Consent not found",};

  await remove(id);
};