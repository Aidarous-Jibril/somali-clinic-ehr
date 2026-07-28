import type { RadiologyResult } from "../types";

export const mapRadiologyResults = ( reports: any[] ): RadiologyResult[] =>
  reports.map((report) => ({
    id: report.id,
    orderId: report.orderId,

    examination: report.order.name,
    modality: report.order.code,

    impression: report.impression,
    findings: report.findings,
    comment: report.comment,

    overallResult: report.overallResult,
    reportedAt: report.reportedAt,

    images: report.images,
  }));