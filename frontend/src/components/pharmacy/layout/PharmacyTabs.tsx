import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";

import { PHARMACY_TABS } from "../../../features/pharmacy";
import type { PharmacyTab } from "../../../features/pharmacy";

type PharmacyTabsProps = {
  value: PharmacyTab;
  onChange: (tab: PharmacyTab) => void;
};

const PharmacyTabs = ({ value, onChange, }: PharmacyTabsProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        mb: 3,
      }}
    >
      <Tabs
        value={value}
        onChange={(_, newValue) =>
          onChange(newValue as PharmacyTab)
        }
        variant="scrollable"
        scrollButtons="auto"
      >
        {PHARMACY_TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default PharmacyTabs;