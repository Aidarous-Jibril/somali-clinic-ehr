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
import { locations } from "../constants";

interface Props {
  open: boolean;
  inventory: InventoryItem | null;
  onClose: () => void;

  onSave?: (payload: {
    id: string;
    quantity: number;
    destination: string;
    notes: string;
  }) => void;
}

const TransferInventoryDialog = ({
  open,
  inventory,
  onClose,
  onSave,
}: Props) => {
  const [quantity, setQuantity] = useState(0);
  const [destination, setDestination] = useState(locations[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;

    setQuantity(0);
    setDestination(locations[0]);
    setNotes("");
  }, [open]);

  if (!inventory) return null;

  const remainingStock = useMemo(() => {
    return inventory.available - quantity;
  }, [inventory.available, quantity]);

  const hasError =
    quantity <= 0 ||
    quantity > inventory.available;

  const handleSave = () => {
    if (hasError) return;

    onSave?.({
      id: inventory.id,
      quantity,
      destination,
      notes,
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Transfer Inventory
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

          <FormControl fullWidth>
            <InputLabel>
              Destination
            </InputLabel>

            <Select
              label="Destination"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
            >
              {locations.map((location) => (
                <MenuItem
                  key={location}
                  value={location}
                >
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
          />

          <Alert severity="info">
            Transfer{" "}
            <strong>{quantity}</strong>{" "}
            units to{" "}
            <strong>{destination}</strong>.
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes"
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
              fullWidth
              label="Current Stock"
              value={inventory.available}
              slotProps={{
                input: {
                readOnly: true,
                },
              }}
            />

            <TextField
              fullWidth
              label="Remaining Stock"
              value={remainingStock}
              slotProps={{
                input: {
                readOnly: true,
                },
              }}
            />
          </Stack>

          {hasError && (
            <Alert severity="error">
              Quantity must be greater than 0 and cannot exceed
              available stock.
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
          onClick={handleSave}
          disabled={hasError}
        >
          Transfer Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferInventoryDialog;