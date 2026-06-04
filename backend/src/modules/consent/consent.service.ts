import {
  createConsent,
  getConsentsByPatient,
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

export const getPatientConsents = async ( patientId: string ) => {
  const rows = await getConsentsByPatient(patientId);

  return rows.map(mapConsent);
};

export const registerConsent = async ( data: any) => {
  const consent = await createConsent(data);

  return mapConsent(consent);
};

export const changeConsentStatus = async ( id: string, status: string ) => {
  const consent = await updateConsentStatus( id, status);

  return mapConsent(consent);
};