import { z } from "zod";

export const medicationFormSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  encounterId: z.string().optional(),

  name: z.string().min(1, "Medication name is required"),
  strength: z.string().optional(),
  dose: z.string().min(1, "Dose is required"),

  frequency: z.enum([
    "once_daily",
    "twice_daily",
    "three_times_daily",
    "four_times_daily",
    "as_needed",
  ]),

  groupType: z.enum([
    "current",
    "prn",
    "notScheduled",
    "generalDirective",
  ]),

  dosingText: z.string().optional(),
  indication: z.string().optional(),
});

export type MedicationFormValues = z.infer<typeof medicationFormSchema>;

export const medicationFrequencyOptions = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "Three times daily" },
  { value: "four_times_daily", label: "Four times daily" },
  { value: "as_needed", label: "As needed (PRN)" },
] as const;

export const medicationGroupOptions = [
  { value: "current", label: "Current medication" },
  { value: "prn", label: "PRN (as needed)" },
  { value: "notScheduled", label: "Not scheduled" },
  { value: "generalDirective", label: "General directive" },
] as const;