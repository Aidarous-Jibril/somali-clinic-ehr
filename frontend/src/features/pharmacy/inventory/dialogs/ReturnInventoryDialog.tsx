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

import type { InventoryItem } from "../../types";
import { returnReasons } from "../../constants";

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

const ReturnInventoryDialog = ({
  open,
  inventory,
  onClose,
  onSave,
}: Props) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState(returnReasons[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;

    setQuantity(0);
    setReason(returnReasons[0]);
    setNotes("");
  }, [open]);

  const remainingDamaged = useMemo(() => {
    if (!inventory) return 0;

    return Math.max(0, inventory.damaged - quantity);
  }, [inventory, quantity]);

  const availableAfterReturn = useMemo(() => {
    if (!inventory) return 0;

    return inventory.available + quantity;
  }, [inventory, quantity]);

  const hasError =
    !inventory ||
    quantity <= 0 ||
    quantity > inventory.damaged;

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
        Return Inventory
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

          {inventory.damaged === 0 && (
            <Alert severity="info">
              This batch has no damaged stock available to return.
            </Alert>
          )}

          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            fullWidth
            disabled={inventory.damaged === 0}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
          />

          <Alert severity="success">
            Return {quantity} unit{quantity !== 1 ? "s" : ""} to available inventory.
          </Alert>

          <FormControl
            fullWidth
            disabled={inventory.damaged === 0}
          >
            <InputLabel>
              Return Reason
            </InputLabel>

            <Select
              label="Return Reason"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
            >
              {returnReasons.map((item) => (
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
            value={notes}
            disabled={inventory.damaged === 0}
            fullWidth
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />

          <Divider />

          {/* Damaged inventory summary */}

          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              label="Current Damaged"
              value={inventory.damaged}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <TextField
              label="Returned"
              value={quantity}
              color="success"
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <TextField
              label="Remaining Damaged"
              value={remainingDamaged}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Stack>

          {/* Available inventory summary */}

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
              label="Available After Return"
              value={availableAfterReturn}
              color="success"
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Stack>

          {hasError && inventory.damaged > 0 && (
            <Alert severity="error">
              Quantity must be greater than 0 and cannot exceed damaged stock.
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
          color="success"
          onClick={handleSave}
          disabled={
            hasError ||
            inventory.damaged === 0
          }
        >
          Return Inventory
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnInventoryDialog;