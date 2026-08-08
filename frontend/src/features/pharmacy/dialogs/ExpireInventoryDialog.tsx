import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { InventoryItem } from "../types";
import { expireReasons } from "../constants";

interface Props {
  open: boolean;
  inventory: InventoryItem | null;
  onClose: () => void;
  onSave?: (payload: {
    quantity: number;
    reason: string;
    notes: string;
  }) => void;
}

const ExpireInventoryDialog = ({ open, inventory, onClose, onSave, }: Props) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState(expireReasons[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;

    setQuantity(0);
    setReason(expireReasons[0]);
    setNotes("");
  }, [open]);

  const remainingAvailable = useMemo(() => {
    if (!inventory) return 0;

    return Math.max(0, inventory.available - quantity);
  }, [inventory, quantity]);

  const hasError = !inventory || quantity <= 0 || quantity > inventory.available;

  const handleSave = () => {
    if (hasError) return;

    onSave?.({
      quantity,
      reason,
      notes,
    });

    onClose();
  };

  if (!inventory) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Expire Batch
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {inventory.product}
            </Typography>

            <Typography color="text.secondary">
              {inventory.strength} • {inventory.formulation}
            </Typography>
          </Stack>

          <Divider />

          <Alert severity="warning">
            Expired stock will be removed from available inventory and can no
            longer be dispensed.
          </Alert>

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
          />

          <FormControl fullWidth>
            <InputLabel>
              Expiry Reason
            </InputLabel>

            <Select
              label="Expiry Reason"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
            >
              {expireReasons.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Notes"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />

          <Divider />

          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              label="Current Available"
              value={inventory.available}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <TextField
              label="Expiring"
              value={quantity}
              fullWidth
              color="warning"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <TextField
              label="Remaining Available"
              value={remainingAvailable}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Stack>

          {hasError && (
            <Alert severity="error">
              Quantity must be greater than 0 and cannot exceed available stock.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={hasError || inventory.available === 0}
          onClick={handleSave}
        >
          Expire Batch
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpireInventoryDialog;