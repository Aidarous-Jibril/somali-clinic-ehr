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
import { damageReasons } from "../../constants";

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

const DamageInventoryDialog = ({
  open,
  inventory,
  onClose,
  onSave,
}: Props) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState(damageReasons[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;

    setQuantity(0);
    setReason(damageReasons[0]);
    setNotes("");
  }, [open]);

  const remainingStock = useMemo(() => {
    if (!inventory) return 0;

    return inventory.available - quantity;
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
        Damage Inventory
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

          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            fullWidth
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
          />

          <Alert severity="warning">
            Mark {quantity} unit{quantity !== 1 ? "s" : ""} as damaged.
          </Alert>

          <FormControl fullWidth>
            <InputLabel>
              Damage Reason
            </InputLabel>

            <Select
              label="Damage Reason"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
            >
              {damageReasons.map((item) => (
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
            fullWidth
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
              label="Current Stock"
              value={inventory.available}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Damaged Qty"
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
              label="Remaining Stock"
              value={remainingStock}
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
          color="warning"
          disabled={hasError}
          onClick={handleSave}
        >
          Mark Damaged
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DamageInventoryDialog;