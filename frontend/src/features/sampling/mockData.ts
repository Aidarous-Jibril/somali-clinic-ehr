import type { SamplingWorklistItem } from "./types";

export const mockSamplingWorklist: SamplingWorklistItem[] = [
  {
    id: "wl-1",
    dateTime: "2021-03-17 11:10",
    personId: "19 400133-0002",
    patientName: "Alice Fast",
    specialty: "Clinical chemistry",
    rid: "80000857",

    orderingUnit: "Medical ward 1",
    requester: "Johan Svärd, MD",
    responseRecipient: "Johan Svärd, MD",
    responseRecipientUnit: "Medical ward 1",
    payingUnit: "Medicine division",
    orderIdentity: "80000857",

    plannedSamplingDate: "2021-03-17",
    plannedSamplingTime: "11:10",
    samplingDate: "2021-03-17",
    samplingTime: "11:13",

    priority: "Routine",

    tubeGroups: [
      {
        id: "t1",
        label: "EDTA K2 5 mL (Purple/Black)",
        analyses: ["B-Hemoglobin (Hb)", "B-Platelets", "B-EVF"],
      },
      {
        id: "t2",
        label: "Gel + Li-heparin 7 mL (Green/Yellow)",
        analyses: ["P-Sodium", "P-Potassium", "P-CRP", "P-ALAT", "P-Albumin"],
      },
    ],

    printed: false,
    sent: false,
    samplerComment: "",
    requesterComment: "",
  },
  {
    id: "wl-2",
    dateTime: "2021-03-17 11:09",
    personId: "19 530832-0000",
    patientName: "Yvonne Fyrtorn",
    specialty: "Clinical chemistry",
    rid: "80000856",

    orderingUnit: "Medical ward 1",
    requester: "Johan Svärd, MD",
    responseRecipient: "Johan Svärd, MD",
    responseRecipientUnit: "Medical ward 1",
    payingUnit: "Medicine division",
    orderIdentity: "80000856",

    plannedSamplingDate: "2021-03-17",
    plannedSamplingTime: "11:09",
    samplingDate: "2021-03-17",
    samplingTime: "11:12",

    priority: "Routine",

    tubeGroups: [
      {
        id: "t1",
        label: "EDTA K2 5 mL (Purple/Black)",
        analyses: ["B-Hemoglobin (Hb)"],
      },
      {
        id: "t2",
        label: "Citrate 6.5 mL (Black)",
        analyses: ["B-SR"],
      },
    ],

    printed: true,
    sent: false,
    samplerComment: "",
    requesterComment: "",
  },
  {
    id: "wl-3",
    dateTime: "2021-03-17 11:08",
    personId: "19 480732-0009",
    patientName: "Ulrika Maskros",
    specialty: "Microbiology",
    rid: "70000145",

    orderingUnit: "Emergency department",
    requester: "Olof Högdal, MD",
    responseRecipient: "Olof Högdal, MD",
    responseRecipientUnit: "Emergency department",
    payingUnit: "Medicine division",
    orderIdentity: "70000145",

    plannedSamplingDate: "2021-03-17",
    plannedSamplingTime: "11:08",
    samplingDate: "2021-03-17",
    samplingTime: "11:15",

    priority: "Urgent",

    tubeGroups: [
      {
        id: "t1",
        label: "Blood culture set",
        analyses: ["Blood culture x2"],
      },
      {
        id: "t2",
        label: "Urine sample",
        analyses: ["Urine culture"],
      },
    ],

    printed: false,
    sent: false,
    samplerComment: "",
    requesterComment: "",
  },
];
