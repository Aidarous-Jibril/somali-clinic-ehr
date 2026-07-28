//modules/dashboard/radiology/radiology.mapper.ts
export const toRadiologyWorklistItem = (order: any) => {
  const clinicName = order.clinic?.name ?? "";

  const performerUnitName = order.performerUnit?.name ?? "";

  const orderingUnit = performerUnitName ? `${clinicName} • ${performerUnitName}` : clinicName;

  const requester = order.orderedByAccount?.person
      ? `${order.orderedByAccount.person.firstName} ${order.orderedByAccount.person.lastName}`
      : "Unknown requester";

  const report = order.radiologyReport;

  return {
    id: order.id,
    orderId: order.id,
    patientId: order.patient.id,
    patientName: `${order.patient.firstName} ${order.patient.lastName}`,
    personId: order.patient.mrn,
    examination: order.name,
    modality: order.code,
    category: order.category,
    status: order.status,
    orderingUnit,
    requester,
    orderedAt: order.orderedAt,
    resultedAt: order.resultedAt,
    reviewedAt: order.reviewedAt,
    impression: report?.impression ?? "",
    findings: report?.findings ?? "",
    overallResult: report?.overallResult ?? null,
    comment: report?.comment ?? "",
    images:
    report?.images?.map((image: any) => ({
        id: image.id,
        fileName: image.fileName,
        viewName: image.viewName,
        url: image.filePath,
    })) ?? []
  };
};
