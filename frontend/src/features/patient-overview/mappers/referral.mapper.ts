// src/features/patient-overview/mappers/referral.mapper.ts
import { formatDateTime } from "../../../utils/dateFormat";
import type { Referral } from "../types";

/** Backend → UI mapper */
export const mapReferralToUi = (r: any): Referral => {
  const toUnitName = r.toUnit?.name ?? "—";
  const toClinicName = r.toUnit?.clinic?.name ?? "";

  const fromUnitName = r.fromUnit?.name ?? "";
  const fromClinicName = r.fromClinic?.name ?? "";

  // sentByAccount -> person
  const firstName = r.sentByAccount?.person?.firstName ?? "";
  const lastName = r.sentByAccount?.person?.lastName ?? "";

  return {
    id: r.id,

    to: `${toUnitName}${toClinicName ? ` • ${toClinicName}` : ""}`,
    from: `${fromUnitName}${fromClinicName ? ` • ${fromClinicName}` : ""}`,

    toUnitId: r.toUnitId,
    fromUnitId: r.fromUnitId,

    // Staff info
    sentByName: `${firstName} ${lastName}`.trim() || undefined,
    sentByRole: r.sentByAccount?.role,
    sentByUnit:
      r.sentByAccount?.assignments?.[0]?.unit?.name,

    status: mapBackendStatusToUi(r.status),

    urgent: r.urgent,
    hasAdditionalInfo: r.hasAdditionalInfo,
    details: r.details,
    date: formatDateTime(r.createdAt),
  };
};

/**
 * Backend status → UI status
 */
export const mapBackendStatusToUi = (status: string) => {
  switch (status) {
    case "unassessed":
      return "Unassessed";
    case "accepted":
      return "Accepted";
    case "in_progress":
      return "In progress";
    case "completed":
      return "Completed";
    default:
      return "Unassessed";
  }
};

/**
 * UI → Backend status
 */
export const mapUiStatusToBackend = (status: string) => {
  switch (status) {
    case "Unassessed":
      return "unassessed";
    case "Accepted":
      return "accepted";
    case "In progress":
      return "in_progress";
    case "Completed":
      return "completed";
    default:
      return "unassessed";
  }
};