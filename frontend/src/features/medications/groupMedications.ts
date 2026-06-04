import type { Medication, MedicationGroup } from "./types";

export function groupMedications(meds: Medication[]): MedicationGroup[] {
  const groups: MedicationGroup[] = [
    { key: "current", title: "Current medications", items: [] },
    { key: "prn", title: "PRN (as needed)", items: [] },
    { key: "notScheduled", title: "Not scheduled", items: [] },
    { key: "generalDirective", title: "General directives", items: [] },
  ];

  meds.forEach((med) => {
    const target = groups.find((g) => g.key === med.group);
    if (target) target.items.push(med);
  });

  return groups.filter((g) => g.items.length > 0);
}