// // dashboard/laboratory/laboratory.mapper.ts
export const toLaboratoryWorklistItem = (order: any) => {
  const sample = order.samples?.[0];

  const clinicName = order.clinic?.name ?? "";

  const performerUnitName = order.performerUnit?.name ?? "";

  const orderingUnit = performerUnitName ? `${clinicName} • ${performerUnitName}` : clinicName;

  const requester =
    order.orderedByAccount?.person
      ? `${order.orderedByAccount.person.firstName} ${order.orderedByAccount.person.lastName}`
      : "Unknown requester";

  return {
    id: order.id,
    orderId: order.id,

    patientId: order.patient.id,
    patientName: `${order.patient.firstName} ${order.patient.lastName}`,
    personId: order.patient.mrn,

    analysis: order.name,
    code: order.code,

    category: order.category,

    status: order.status,

    orderingUnit,

    requester,

    orderedAt: order.orderedAt,

    sample:
      sample
        ? {
            id: sample.id,
            status: sample.status,
            sampleType: sample.sampleType,
            barcode: sample.barcode,
            collectedAt: sample.collectedAt,
            receivedAt: sample.receivedAt,
            processedAt: sample.processedAt,
            completedAt: sample.completedAt,
            notes: sample.notes,
          }
        : null,
  };
};