import type { ReactNode } from "react";
import Box from "@mui/material/Box";

import PharmacyHeader from "./PharmacyHeader";
import PharmacyTabs from "./PharmacyTabs";
import PharmacyToolbar from "./PharmacyToolbar";

import type { PharmacyTab, PharmacyToolbarAction, PharmacyToolbarFilter } from "../../../features/pharmacy";

type PharmacyPageLayoutProps = {
  activeTab: PharmacyTab;
  onTabChange: (tab: PharmacyTab) => void;

  search?: string;
  searchPlaceholder?: string;

  filters?: PharmacyToolbarFilter[];
  actions?: PharmacyToolbarAction[];

  onSearch?: (value: string) => void;
  onFilterChange?: ( id: string, value: string ) => void;
  
  children: ReactNode;
};

const PharmacyPageLayout = ({
  activeTab,
  onTabChange,

  search,
  searchPlaceholder,

  filters = [],
  actions = [],

  onSearch,
  onFilterChange,

  children,
}: PharmacyPageLayoutProps) => {
  return (
    <Box>
      <PharmacyHeader />

      <PharmacyTabs
        value={activeTab}
        onChange={onTabChange}
      />

      <PharmacyToolbar
        search={search}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        actions={actions}
        onSearch={onSearch}
        onFilterChange={onFilterChange}
      />

      <Box mt={2}>
        {children}
      </Box>
    </Box>
  );
};

export default PharmacyPageLayout;