import {
  Box,
  Grid,
} from "@mui/material";

import PharmacyStats from "./PharmacyStats";
import LowStockCard from "./LowStockCard";
import ExpiringInventoryCard from "./ExpiringInventoryCard";
import PendingPurchasesCard from "./PendingPurchasesCard";
import PendingDispensingCard from "./PendingDispensingCard";
import RecentMovementsCard from "./RecentMovementsCard";

const PharmacyDashboard = () => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* KPI statistics */}
      <PharmacyStats />

      {/* Alerts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <LowStockCard />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ExpiringInventoryCard />
        </Grid>
      </Grid>

      {/* Activity */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <RecentMovementsCard />
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <PendingDispensingCard />
        </Grid>
      </Grid>

      {/* Purchases */}
      <PendingPurchasesCard />
    </Box>
  );
};

export default PharmacyDashboard;