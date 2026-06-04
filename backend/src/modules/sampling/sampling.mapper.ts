export const toSamplingWorklistItem = (sample: any) => {
  const clinicName = sample.order?.clinic?.name;
  const performerUnitName = sample.order?.performerUnit?.name;
  const orderingUnit = performerUnitName ? `${clinicName} • ${performerUnitName}` : clinicName || "Unknown unit";

  return {
    id: sample.id,
    patientId: sample.patient.id,
    patientName: `${sample.patient.firstName} ${sample.patient.lastName}`,
    // MRN instead of personal number
    personId: sample.patient.mrn,
    dateTime: sample.createdAt,
    specialty: sample.order?.category || "Laboratory",
    rid: sample.barcode,
    orderId: sample.orderId,
    orderingUnit,
    requester:
      sample.order?.orderedByAccount?.person
        ? `${sample.order.orderedByAccount.person.firstName} ${sample.order.orderedByAccount.person.lastName}`
        : "Unknown requester",

    responseRecipient: "",
    responseRecipientUnit: "",
    payingUnit: "",
    orderIdentity: sample.orderId,
    plannedSamplingDate: sample.createdAt,
    plannedSamplingTime: sample.createdAt,
    samplingDate:sample.collectedAt,
    samplingTime: sample.collectedAt,
    priority: "Routine",
    sampleType: sample.sampleType,
    status: sample.status,
    barcode: sample.barcode,
    collectedAt: sample.collectedAt,
    receivedAt: sample.receivedAt,
    processedAt: sample.processedAt,
    tubeGroups: [
      {
        id: `${sample.id}-group`,

        label:
          `${sample.sampleType.toUpperCase()} sample`,

        analyses: [
          sample.order?.name ||
            "Laboratory analysis",
        ],
      },
    ],

    printed: false,
    sent: sample.status === "completed",
    samplerComment: sample.notes || "",
    requesterComment: "",
  };
};