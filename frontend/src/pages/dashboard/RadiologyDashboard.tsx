//src/pages/dashboard/RadiologyDashboard.tsx
import { useMemo, useState } from "react";
import { Box, Typography, Paper, Stack, Button, } from "@mui/material";

import { useRadiologyWorklist } from "../../hooks/radiology/useRadiologyWorklist";
import { useStartRadiologyOrder } from "../../hooks/radiology/useStartRadiologyOrder";
import { useSubmitRadiologyReport } from "../../hooks/radiology/useSubmitRadiologyReport";
import RadiologyReportDialog from "../../components/radiology/RadiologyReportDialog";

const RadiologyDashboard = () => {
  const { data, isLoading } = useRadiologyWorklist();

  const startMutation = useStartRadiologyOrder();
  const submitReportMutation = useSubmitRadiologyReport();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const orders = useMemo(() => data ?? [], [data]);

  const handleSubmitReport = async ( payload: FormData ) => {
    if (!selectedOrder) return;

    await submitReportMutation.mutateAsync({
      orderId: selectedOrder.orderId,
      payload,
    });

    setSelectedOrder(null);
    setReportOpen(false);
};

  if (isLoading) {
    return (
      <Box p={3}>
        Loading radiology dashboard...
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4">
        Radiology Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Active radiology worklist
      </Typography>

      <Stack spacing={2}>
        {orders.length === 0 && (
          <Paper sx={{ p: 3 }}>
            No radiology examinations.
          </Paper>
        )}

        {orders.map((order: any) => (
          <Paper
            key={order.orderId}
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography fontWeight={600}>
                {order.examination}
              </Typography>

              <Typography variant="body2">
                {order.patientName}
              </Typography>

              <Typography variant="body2">
                Status: {order.status}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              {order.status === "ordered" && (
                <Button
                  variant="contained"
                  disabled={startMutation.isPending}
                  onClick={() =>
                    startMutation.mutate(order.orderId)
                  }
                >
                  Start Exam
                </Button>
              )}

              {order.status === "awaiting_result" && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelectedOrder(order);
                    setReportOpen(true);
                  }}
                >
                  Write Report
                </Button>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <RadiologyReportDialog
        open={reportOpen}
        order={selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
          setReportOpen(false);
        }}
        onSubmit={handleSubmitReport}
      />
    </Box>
  );
};

export default RadiologyDashboard;