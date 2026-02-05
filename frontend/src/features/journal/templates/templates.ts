// src/features/journal/templates/templates.ts
import type { JournalTemplate } from "../types";

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  // SBAR (Nursing)
  {
    id: "tpl-sbar-nursing",
    label: "SBAR (Nursing)",
    noteType: "progress_note",
    sections: [
      { key: "situation", label: "Situation", placeholder: "What is happening right now?", multiline: true },
      { key: "background", label: "Background", placeholder: "Relevant history / context", multiline: true },
      { key: "assessment", label: "Assessment", placeholder: "Your assessment / vital signs / findings", multiline: true },
      { key: "recommendation", label: "Recommendation", placeholder: "What do you need / recommend?", multiline: true },
    ],
  },

  // SBAR (Physician)
  {
    id: "tpl-sbar-physician",
    label: "SBAR (Physician)",
    noteType: "progress_note",
    sections: [
      { key: "situation", label: "Situation", placeholder: "Reason for note / call / review", multiline: true },
      { key: "background", label: "Background", placeholder: "Pertinent history / key events", multiline: true },
      { key: "assessment", label: "Assessment", placeholder: "Clinical assessment / differential", multiline: true },
      { key: "recommendation", label: "Recommendation", placeholder: "Plan / orders / follow-up", multiline: true },
    ],
  },

  // Regular templates
  {
    id: "tpl-physician-followup",
    label: "Physician follow-up",
    noteType: "progress_note",
    sections: [
      { key: "reason", label: "Reason for contact", placeholder: "Why is the patient contacting the clinic?", multiline: true },
      { key: "assessment", label: "Assessment", placeholder: "Clinical assessment / findings", multiline: true },
      { key: "plan", label: "Plan", placeholder: "Plan / follow-up / referrals", multiline: true },
    ],
  },
  {
    id: "tpl-admission",
    label: "Admission note",
    noteType: "admission_note",
    sections: [
      { key: "history", label: "History", placeholder: "Relevant history", multiline: true },
      { key: "medications", label: "Medications", placeholder: "Current medications", multiline: true },
      { key: "assessment", label: "Assessment", placeholder: "Assessment", multiline: true },
      { key: "plan", label: "Plan", placeholder: "Plan", multiline: true },
    ],
  },
  {
    id: "tpl-nursing",
    label: "Nursing note",
    noteType: "progress_note",
    sections: [
      { key: "status", label: "Patient status", placeholder: "General status, vitals, symptoms", multiline: true },
      { key: "nursing_actions", label: "Nursing actions", placeholder: "Interventions performed", multiline: true },
      { key: "response", label: "Response / evaluation", placeholder: "Patient response / evaluation", multiline: true },
    ],
  },
  {
    id: "tpl-nutrition-dietitian",
    label: "Nutrition / Dietitian note",
    noteType: "progress_note",
    sections: [
      { key: "reason", label: "Reason / referral", placeholder: "Why nutrition review? (weight loss, DM, renal, stroke dysphagia, etc.)", multiline: true },
      { key: "intake", label: "Current intake", placeholder: "Appetite, oral intake, fluids, vomiting/diarrhea, NPO/NG/PEG", multiline: true },
      { key: "anthropometrics", label: "Weight / MUAC / BMI", placeholder: "Weight, height, MUAC (if used), recent change", multiline: true },
      { key: "risk", label: "Nutrition risk / assessment", placeholder: "Malnutrition risk, dehydration, swallowing issues, labs if available", multiline: true },
      { key: "plan", label: "Plan", placeholder: "Diet advice, supplements, feeding plan, monitoring, follow-up", multiline: true },
    ],
  },
  {
    id: "tpl-physio",
    label: "Physiotherapy note",
    noteType: "progress_note",
    sections: [
      { key: "mobility", label: "Mobility status", placeholder: "Bed mobility, transfers, walking, aids", multiline: true },
      { key: "assessment", label: "Assessment", placeholder: "Strength, balance, endurance, pain", multiline: true },
      { key: "interventions", label: "Interventions", placeholder: "Exercises, gait training, positioning", multiline: true },
      { key: "goals", label: "Goals", placeholder: "Short-term goals", multiline: true },
      { key: "plan", label: "Plan / follow-up", placeholder: "Frequency, home program, referrals", multiline: true },
    ],
  },

];
