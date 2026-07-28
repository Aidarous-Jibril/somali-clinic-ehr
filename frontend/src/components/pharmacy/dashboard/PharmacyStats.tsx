import { Grid } from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import PharmacyStatCard from "./PharmacyStatCard";
import { mockDashboardStats } from "../../../features/pharmacy";

const PharmacyStats = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <PharmacyStatCard
          title="Products"
          value={mockDashboardStats.totalProducts}
          subtitle="Available products"
          color="#1976d2"
          icon={<Inventory2OutlinedIcon fontSize="large" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <PharmacyStatCard
          title="Low Stock"
          value={mockDashboardStats.lowStock}
          subtitle="Require replenishment"
          color="#f57c00"
          icon={<WarningAmberOutlinedIcon fontSize="large" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <PharmacyStatCard
          title="Expiring Soon"
          value={7}
          subtitle="Within 30 days"
          color="#d32f2f"
          icon={<EventBusyOutlinedIcon fontSize="large" />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <PharmacyStatCard
          title="Pending Purchases"
          value={5}
          subtitle="Awaiting delivery"
          color="#2e7d32"
          icon={<LocalShippingOutlinedIcon fontSize="large" />}
        />
      </Grid>
    </Grid>
  );
};

export default PharmacyStats;