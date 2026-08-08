import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import InventoryStatusChip from "./InventoryStatusChip";

import type { InventoryItem } from "../../../features/pharmacy/types";
import { useState } from "react";
import AdjustInventoryDialog from "../../../features/pharmacy/inventory/dialogs/AdjustInventoryDialog";
import TransferInventoryDialog from "../../../features/pharmacy/inventory/dialogs/TransferInventoryDialog";
import DamageInventoryDialog from "../../../features/pharmacy/inventory/dialogs/DamageInventoryDialog";
import ReturnInventoryDialog from "../../../features/pharmacy/inventory/dialogs/ReturnInventoryDialog";
import ExpireInventoryDialog from "../../../features/pharmacy/inventory/dialogs/ExpireInventoryDialog";


interface Props {
  open: boolean;
  inventory: InventoryItem | null;
  onClose: () => void;

  onAdjust: (payload: {
    id: string;
    type: "increase" | "decrease";
    quantity: number;
  }) => void;

  onTransfer?: (payload: {
    id: string;
    quantity: number;
    destination: string;
    notes: string;
  }) => void;

  onDamage?: (payload: {
    id: string;
    quantity: number;
    reason: string;
    notes: string;
  }) => void;

  onReturn?: (payload: {
    id: string;
    quantity: number;
    reason: string;
    notes: string;
  }) => void;
 
  onExpire?: (payload: {
    id: string;
    quantity: number;
    reason: string;
    notes: string;
  }) => void;
}

const InventoryDetailsDrawer = ({
  open,
  inventory,
  onClose,
  onAdjust,
  onTransfer,
  onDamage,
  onReturn,
  onExpire,
}: Props) => {
  if (!inventory) return null;

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [damageOpen, setDamageOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [expireOpen, setExpireOpen] = useState(false);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 460,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: 3,
        }}
      >
        {/* Header */}

        <Typography variant="h4" fontWeight={700}>
          {inventory.product}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {inventory.strength} • {inventory.formulation}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <InventoryStatusChip status={inventory.status} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Inventory Summary */}

        <Typography variant="h6" gutterBottom>
          Inventory Summary
        </Typography>

        <Grid container spacing={2}>
          <Grid size={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Available
              </Typography>

              <Typography variant="h4">{inventory.available}</Typography>
            </Paper>
          </Grid>

          <Grid size={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Reserved
              </Typography>

              <Typography variant="h4">{inventory.reserved}</Typography>
            </Paper>
          </Grid>

          <Grid size={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Damaged
              </Typography>

              <Typography variant="h4">{inventory.damaged}</Typography>
            </Paper>
          </Grid>

          <Grid size={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Minimum Stock
              </Typography>

              <Typography variant="h4">{inventory.minimumStock}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Batch Information */}

        <Typography variant="h6" gutterBottom>
          Batch Information
        </Typography>

        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Batch</Typography>

            <Typography fontWeight={600}>{inventory.batch}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Expiry</Typography>

            <Typography fontWeight={600}>{inventory.expiry}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Supplier</Typography>

            <Typography fontWeight={600}>{inventory.supplier}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Manufacturer</Typography>

            <Typography fontWeight={600}>{inventory.manufacturer}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Location</Typography>

            <Typography fontWeight={600}>{inventory.location}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Quick Actions */}

        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>

        <Stack spacing={1.5}>
          <Button variant="contained" onClick={() => setAdjustOpen(true)}>
            Adjust Stock
          </Button>

          <Button variant="outlined" onClick={() => setTransferOpen(true)}>
            Transfer Stock
          </Button>

          <Button variant="outlined" onClick={() => setDamageOpen(true)}>
            Mark Damaged
          </Button>

          <Button variant="outlined" onClick={() => setReturnOpen(true)}>
            Return Stock
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => setExpireOpen(true)}
          >
            Expire Batch
          </Button>
        </Stack>
      </Box>

      <AdjustInventoryDialog
        open={adjustOpen}
        inventory={inventory}
        onClose={() => setAdjustOpen(false)}
        onSave={(payload) => {
          onAdjust({
            id: inventory.id,
            type: payload.type,
            quantity: payload.quantity,
          });

          setAdjustOpen(false);
        }}
      />
      <TransferInventoryDialog
        open={transferOpen}
        inventory={inventory}
        onClose={() => setTransferOpen(false)}
        onSave={(payload) => {
          onTransfer?.(payload);
          setTransferOpen(false);
        }}
      />

      <DamageInventoryDialog
        open={damageOpen}
        inventory={inventory}
        onClose={() => setDamageOpen(false)}
        onSave={(payload) => {
          onDamage?.({
            id: inventory.id,
            quantity: payload.quantity,
            reason: payload.reason,
            notes: payload.notes,
          });

          setDamageOpen(false);
        }}
      />

      <ReturnInventoryDialog
        open={returnOpen}
        inventory={inventory}
        onClose={() => setReturnOpen(false)}
        onSave={(payload) => {
            onReturn?.({
            id: inventory.id,
            quantity: payload.quantity,
            reason: payload.reason,
            notes: payload.notes,
            });

            setReturnOpen(false);
        }}
        />

        <ExpireInventoryDialog
            open={expireOpen}
            inventory={inventory}
            onClose={() => setExpireOpen(false)}
            onSave={(payload) => {
                onExpire?.({
                id: inventory.id,
                quantity: payload.quantity,
                reason: payload.reason,
                notes: payload.notes,
                });

                setExpireOpen(false);
            }}
            />
    </Drawer>
  );
};

export default InventoryDetailsDrawer;
