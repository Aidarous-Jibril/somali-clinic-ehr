// src/components/medications/MedicationsTabs.tsx
import { Tabs, Tab } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import type { MedicationTabKey } from "../../../features/medications/types";

const tabs: { key: MedicationTabKey; label: string }[] = [
  { key: "medicationList", label: "Medication list" },
  { key: "dispensingView", label: "Dispensing view" },
  { key: "prescriptionOverview", label: "Prescription overview" },
  { key: "vaccinations", label: "Vaccinations" },
  { key: "nutritionProducts", label: "Nutrition products" },
  { key: "new", label: "New..." },
];

export function MedicationsTabs({ value, onChange }: { value: MedicationTabKey; onChange: (v: MedicationTabKey) => void; }) {
  const [, setSearchParams] = useSearchParams();

  const handleChange = (_: React.SyntheticEvent, v: MedicationTabKey) => {
    // Update local state in parent
    onChange(v);

    // Update URL, eg /patients/:patientId/medications?tab=vaccinations
    setSearchParams({ tab: v });
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        minHeight: 36,
        "& .MuiTab-root": {
          minHeight: 36,
          textTransform: "none",
          fontSize: 13,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          value={tab.key}
          label={tab.label}
        />
      ))}
    </Tabs>
  );
}