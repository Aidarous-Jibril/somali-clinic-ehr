import type {
  MedicationGroup,
  NutritionPrescription,
  Vaccination,
  FavoriteTemplate,
} from "./types";

/* ============================================================================
 * MEDICATION MOCK DATA
 * --------------------------------------------------------------------------
 * Single source of truth for ALL frontend mock data related to medications
 * (until backend integration replaces this file).
 * ========================================================================== */

/* ============================================================================
 * MEDICATIONS — CORE LIST & SCHEDULES
 * ========================================================================== */

/* --------------------------- Current medications --------------------------- */

const currentMedications: MedicationGroup = {
  key: "current",
  title: "Current medications",
  items: [
    {
      id: "m1",
      group: "current",
      name: "Paracetamol",
      strength: "500 mg",
      dosingText: "2 tablets x 4 times/day",
      startDate: "2024-12-11",
      tooltip: "Pain relief and fever reducer.",
      schedule: [
        { date: "2024-12-11", time: "08:00", label: "2 tab", status: "missed" },
        { date: "2024-12-11", time: "12:00", label: "2 tab", status: "given" },
        { date: "2024-12-11", time: "16:00", label: "2 tab", status: "planned" },
        { date: "2024-12-11", time: "20:00", label: "2 tab", status: "planned" },
      ],
    },
  ],
};

/* --------------------------- PRN (as needed) ------------------------------- */

const prnMedications: MedicationGroup = {
  key: "prn",
  title: "PRN (as needed)",
  items: [
    {
      id: "m5",
      group: "prn",
      name: "Zopiclone",
      strength: "5 mg",
      dosingText: "1 tablet PRN at night",
      startDate: "2022-06-14",
      tooltip: "Short-term sleep aid.",
      schedule: [],
    },
  ],
};

/* --------------------------- Not scheduled -------------------------------- */

const notScheduledMedications: MedicationGroup = {
  key: "notScheduled",
  title: "Not scheduled",
  items: [
    {
      id: "m6",
      group: "notScheduled",
      name: "Bactrim",
      strength: "400/80 mg",
      dosingText: "1 tablet x 1 time/day",
      startDate: "", // intentionally empty
      tooltip:
        "Ordered without a start date/time (e.g., before a planned procedure).",
      schedule: [],
    },
  ],
};

/* --------------------------- General directives ---------------------------- */

const generalDirectives: MedicationGroup = {
  key: "generalDirective",
  title: "General directives",
  items: [
    {
      id: "gd1",
      group: "generalDirective",
      name: "Viscotears",
      strength: "2 mg/g",
      dosingText: "1–2 drops single dose",
      startDate: "",
      tooltip: "General directive: for dry eyes (example).",
      schedule: [
        {
          date: "2024-12-11",
          time: "14:45",
          label: "1–2 drops",
          status: "planned",
          tooltip: "Viscotears — general directive dose",
        },
      ],
    },
    {
      id: "gd2",
      group: "generalDirective",
      name: "Loperamid",
      strength: "2 mg",
      dosingText: "1 capsule single dose",
      startDate: "",
      tooltip: "General directive: for diarrhea (example).",
      schedule: [
        {
          date: "2024-12-11",
          time: "12:00",
          label: "1 cap",
          status: "planned",
          tooltip: "Loperamid — general directive dose",
        },
      ],
    },
  ],
};

/* --------------------------- Exported medication groups -------------------- */

export const medicationGroupsMock: MedicationGroup[] = [
  currentMedications,
  prnMedications,
  notScheduledMedications,
  generalDirectives,
];

/* ============================================================================
 * NUTRITION — PRESCRIPTIONS
 * ========================================================================== */

export const nutritionProductsMock: NutritionPrescription[] = [
  {
    id: "nutr-1",
    prescribedAt: "2024-12-23 06:45",
    productName: "Bi-Aglut, 500 g",
    description: "Pasta, fusilli",
    articleNo: "249433",
    productArea: "Gluten-free pasta",
    validUntil: "2025-12-23",
    prescriber: "Chatarine Stengärde, MD",
    issuedDate: "2024-12-23",
    prescribedOn: "Prescription",
    unit: "Medical ward 1",
    packages: 1,
    withdrawals: 1,
    firstWithdrawalBefore: "2024-12-23 - 2025-12-23",
    benefit: "Yes",
    otherInstruction: "-",
    dosingInstruction: "-",
    uuid: "52b50a9e-fe74-4c0b-92eb-32f7722d0331",
    sendStatus: "Sent successfully",
    sentAt: "2024-12-23 06:45",
  },
  {
    id: "nutr-2",
    prescribedAt: "2025-01-15 09:10",
    productName: "Nutridrink Compact, vanilla (4 x 125 ml)",
    description: "Oral nutritional supplement",
    articleNo: "781245",
    productArea: "Nutritional drinks",
    validUntil: "2026-01-15",
    prescriber: "Ahmed Ali, MD",
    issuedDate: "2025-01-15",
    prescribedOn: "Prescription",
    unit: "Primary care clinic",
    packages: 2,
    withdrawals: 0,
    firstWithdrawalBefore: "2025-01-15 - 2026-01-15",
    benefit: "Yes",
    otherInstruction: "Store at room temperature",
    dosingInstruction: "1 bottle daily",
    uuid: "c9c2a1c4-7b35-4a13-9c0c-1b7aa6a3d1af",
    sendStatus: "Sent successfully",
    sentAt: "2025-01-15 09:10",
  },
];

/* ============================================================================
 * VACCINATIONS — TIMELINE & CARD
 * ========================================================================== */

export const vaccinationsMock: Vaccination[] = [
  {
    id: "v1",
    name: "Synflorix",
    atcCode: "J07AL52",
    form: "Injection suspension",
    route: "IM",
    reason: "vaccination against pneumococcus",
    startDate: "2025-05-08",
    tooltip: "Pneumococcal vaccine",
    events: [
      { at: "2025-05-08T08:00", doseLabel: "1 dose", status: "planned" },
      { at: "2025-05-08T08:13", doseLabel: "1 dose", status: "given" },
    ],
  },
  {
    id: "v2",
    name: "Rotarix",
    atcCode: "J07BH01",
    form: "Oral suspension",
    route: "Oral",
    reason: "vaccination against rotavirus",
    startDate: "2025-05-08",
    tooltip: "Rotavirus vaccine",
    events: [
      { at: "2025-05-08T08:13", doseLabel: "1 dose", status: "given" },
    ],
  },
  {
    id: "v3",
    name: "Hexyon",
    atcCode: "J07CA09",
    form: "Injection suspension",
    route: "IM",
    reason:
      "vaccination against diphtheria/tetanus/pertussis",
    startDate: "2025-05-08",
    tooltip: "DTaP-IPV-HepB-Hib",
    events: [
      { at: "2025-05-08T08:00", doseLabel: "1 dose", status: "planned" },
    ],
  },
];

/* ============================================================================
 * FAVORITE PRESCRIPTION TEMPLATES (NEW MEDICATION)
 * ========================================================================== */

export const favoriteTemplatesMock: FavoriteTemplate[] = [
  {
    id: "fav_alvedon",
    treatmentReason: "smärta",
    templateName: "Alvedon 500mg 2x4i10d",
    product: "Alvedon",
    form: "Filmdragerad tabl.",
    strength: "500 mg",
    dosing: "2 tabletter x 4 i 10 d",
    route: "Oralt",
    recommended: true,
    eped: true,
  },
  {
    id: "fav_calcichew",
    treatmentReason: "förebyggande av vitamin D",
    templateName: "Calcichew-D3 Citron 1x1",
    product: "Calcichew-D3",
    form: "Tuggtabl.",
    strength: "500 mg/400 IE",
    dosing: "Enligt schema",
    route: "Oralt",
    recommended: true,
  },
  {
    id: "fav_dolcontin",
    treatmentReason: "smärta",
    templateName: "Dolcontin tabl 5 mg",
    product: "Dolcontin",
    form: "Depottabl.",
    strength: "5 mg",
    dosing: "1 depottabl.",
    route: "Oralt",
  },
  {
    id: "fav_enalapril",
    treatmentReason: "hjärtsvikt",
    templateName: "Enalapril (Enalapril) tabl",
    product: "Enalapril",
    form: "Tabl.",
    strength: "5 mg",
    dosing: "Enligt schema",
    route: "Oralt",
    recommended: true,
  },
  {
    id: "fav_ringer",
    treatmentReason: "parenteral rehydrering",
    templateName: "hydreringvätska (Ringer)",
    product: "Ringer",
    form: "Infusionsvätska",
    strength: "—",
    dosing: "1000 ml vb",
    route: "IV",
  },
];

/* ============================================================================
 * DISPENSING / ADMINISTRATION — SIGNING & HANDOVER
 * ========================================================================== */

/** Mock nurses used for signing administrations */
export const MOCK_SIGNERS = [
  { id: "n1", name: "Nurse Amina Yusuf" },
  { id: "n2", name: "Nurse Sofia Ali" },
  { id: "n3", name: "Nurse Ahmed Hassan" },
  { id: "n4", name: "Nurse Emma Karlsson" },
];

/** Default signer when opening dialogs */
export const DEFAULT_SIGNER_ID = "n4";

/* ------------------------------ Handover ---------------------------------- */

/** Reuse same mock users for handover */
export const MOCK_HANDOVER_TO = MOCK_SIGNERS;

/** Default handover recipient */
export const DEFAULT_HANDOVER_TO_ID = "n1";
