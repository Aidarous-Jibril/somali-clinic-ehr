//radiology.mapper.ts

export const toRadiologyResult = (report: any) => ({
  id: report.id,
  orderId: report.order.id,
  examination: report.order.name,
  modality: report.order.code,
  impression: report.impression,
  findings: report.findings,
  overallResult: report.overallResult,
  comment: report.comment,
  reportedAt: report.reportedAt,
  status: report.order.status,
  images:
    report.images.map((img: any) => ({
      id: img.id,
      fileName: img.fileName,
      url: img.filePath,
      viewName: img.viewName,
    })),
});