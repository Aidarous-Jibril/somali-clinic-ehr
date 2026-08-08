import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import type { InventoryItem } from "../../../features/pharmacy/types";
import { adjustmentReasons } from "../constants";

interface Props {
  open: boolean;
  inventory: InventoryItem | null;
  onClose: () => void;
  onSave?: (payload: {
    type: "increase" | "decrease";
    quantity: number;
    reason: string;
    notes: string;
  }) => void;
}

const AdjustInventoryDialog = ({ open, inventory, onClose, onSave }: Props) => {
  const [type, setType] = useState<"increase" | "decrease">("increase");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState(adjustmentReasons[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;

    setType("increase");
    setQuantity(0);
    setReason(adjustmentReasons[0]);
    setNotes("");
  }, [open]);

  const newStock = useMemo(() => {
    if (!inventory) return 0;

    return type === "increase"
      ? inventory.available + quantity
      : inventory.available - quantity;
  }, [inventory, quantity, type]);

  const hasError =
    quantity <= 0 || !inventory || (type === "decrease" && newStock < 0);

  const handleSave = () => {
    if (hasError) return;

    onSave?.({
      type,
      quantity,
      reason,
      notes,
    });

    onClose();
  };

  if (!inventory) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adjust Inventory</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              {inventory.product}
            </Typography>

            <Typography color="text.secondary">
              {inventory.strength} • {inventory.formulation}
            </Typography>
          </Stack>

          <Divider />

          <FormControl fullWidth>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Adjustment Type
            </Typography>

            <ToggleButtonGroup
              exclusive
              fullWidth
              value={type}
              onChange={(_, value) => {
                if (value) {
                  setType(value);
                }
              }}
            >
              <ToggleButton value="increase">+ Increase</ToggleButton>

              <ToggleButton value="decrease">− Decrease</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>

          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value || 0))}
            fullWidth
          />
          <Alert severity="info">
            {type === "increase"
              ? `Increase stock by ${quantity} units`
              : `Decrease stock by ${quantity} units`}
          </Alert>

          <FormControl fullWidth>
            <InputLabel>Reason</InputLabel>

            <Select
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {adjustmentReasons.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />

          <Divider />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Current Stock"
              value={inventory.available}
              slotProps={{
                input: {
                readOnly: true,
                },
              }}
              fullWidth
            />

            <TextField
              label="New Stock"
              value={newStock}
              slotProps={{
                input: {
                readOnly: true,
                },
              }}
              fullWidth
              color={type === "increase" ? "success" : "warning"}
            />
          </Stack>

          {type === "decrease" && newStock < 0 && (
            <Alert severity="error">Stock cannot become negative.</Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSave} disabled={hasError}>
          Save Adjustment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdjustInventoryDialog;
