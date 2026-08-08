import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import PharmacyPageLayout from "../components/pharmacy/layout/PharmacyPageLayout";

import type { PharmacyTab, PharmacyToolbarAction, PharmacyToolbarFilter, } from "../features/pharmacy";
import PharmacyDashboard from "../components/pharmacy/dashboard/PharmacyDashboard";
import InventoryPage from "../components/pharmacy/inventory/InventoryPage";

const PharmacyPage = () => {
  const [activeTab, setActiveTab] = useState<PharmacyTab>("dashboard");
  const [search, setSearch] = useState("");

  const filters = useMemo<PharmacyToolbarFilter[]>(() => {
    switch (activeTab) {
      case "dashboard":
        return [];

      case "inventory":
        return [];

      case "purchases":
        return [];

      case "suppliers":
        return [];

      case "dispensing":
        return [];

      default:
        return [];
    }
  }, [activeTab]);

  const actions = useMemo<PharmacyToolbarAction[]>(() => {
    switch (activeTab) {
      case "dashboard":
        return [
          {
            label: "Refresh",
            onClick: () => console.log("Refresh"),
          },
        ];

      case "inventory":
        return [
          {
            label: "Add Inventory",
            onClick: () =>
              console.log("Add Inventory"),
          },
        ];

      case "purchases":
        return [
          {
            label: "New Purchase",
            onClick: () =>
              console.log("New Purchase"),
          },
        ];

      case "suppliers":
        return [
          {
            label: "New Supplier",
            onClick: () =>
              console.log("New Supplier"),
          },
        ];

      case "dispensing":
        return [];

      default:
        return [];
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6">
              Pharmacy Dashboard
            </Typography>

            <Typography color="text.secondary">
              <PharmacyDashboard />
            </Typography>
          </Paper>
        );

      case "inventory":
        return <InventoryPage />;

      case "purchases":
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6">
              Purchases
            </Typography>

            <Typography color="text.secondary">
              Purchase management coming soon...
            </Typography>
          </Paper>
        );

      case "suppliers":
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6">
              Suppliers
            </Typography>

            <Typography color="text.secondary">
              Supplier management coming soon...
            </Typography>
          </Paper>
        );

      case "dispensing":
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6">
              Dispensing
            </Typography>

            <Typography color="text.secondary">
              Dispensing worklist coming soon...
            </Typography>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <PharmacyPageLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      search={search}
      searchPlaceholder="Search..."
      filters={filters}
      actions={actions}
      onSearch={setSearch}
      onFilterChange={(id, value) =>
        console.log(id, value)
      }
    >
      <Box>{renderContent()}</Box>
    </PharmacyPageLayout>
  );
};

export default PharmacyPage;