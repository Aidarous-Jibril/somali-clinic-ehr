// src/components/medications/MedicationsTabs.tsx
import { Tabs, Tab } from "@mui/material";
import type { MedicationTabKey } from "../../../features/medications/types";

const tabs: { key: MedicationTabKey; label: string }[] = [
  { key: "medicationList", label: "Medication list" },
  { key: "dispensingView", label: "Dispensing view" },
  { key: "prescriptionOverview", label: "Prescription overview" },
  { key: "vaccinations", label: "Vaccinations" },
  { key: "nutritionProducts", label: "Nutrition products" },
  { key: "new", label: "New..." },
];

export function MedicationsTabs({
  value,
  onChange,
}: {
  value: MedicationTabKey;
  onChange: (v: MedicationTabKey) => void;
}) {
  return (
    <Tabs
      value={value}
      onChange={(_, v) => onChange(v)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        minHeight: 36,
        "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontSize: 13 },
      }}
    >
      {tabs.map((t) => (
        <Tab key={t.key} value={t.key} label={t.label} />
      ))}
    </Tabs>
  );
}
