import { Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import InventoryTable from "./InventoryTable";
import InventoryDetailsDrawer from "./InventoryDetailsDrawer";

import { mockInventory } from "../../../features/pharmacy/constants";
import type { InventoryItem } from "../../../features/pharmacy/types";

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);

  const selectedInventory = useMemo(
    () => inventory.find( (item) => item.id === selectedInventoryId, ) ?? null,
    [inventory, selectedInventoryId],
  );

  const handleAdjustInventory = ({ id, type, quantity, }: { id: string; type: "increase" | "decrease"; quantity: number; }) => {
    setInventory((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;

        const available = type === "increase" ? item.available + quantity : Math.max(0, item.available - quantity);

        let status: InventoryItem["status"] = "IN_STOCK";

        if (available === 0) {
          status = "OUT_OF_STOCK";
        } else if (
          available <= item.minimumStock
        ) {
          status = "LOW_STOCK";
        }

        return {
          ...item,
          available,
          status,
        };
      }),
    );
  };

  const handleTransferInventory = ({
    id,
    quantity,
    destination,
    notes,
  }: {
    id: string;
    quantity: number;
    destination: string;
    notes: string;
  }) => {
    // destination and notes are intentionally unused for now.
    // They'll be sent to the backend in Phase 4.
    void destination;
    void notes;

    setInventory((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;

        const available = Math.max( 0, item.available - quantity, );

        let status: InventoryItem["status"] = "IN_STOCK";

        if (available === 0) {
          status = "OUT_OF_STOCK";
        } else if (
          available <= item.minimumStock
        ) {
          status = "LOW_STOCK";
        }

        return {
          ...item,
          available,
          status,
        };
      }),
    );
  };

  const calculateStatus = ( available: number, minimumStock: number, ): InventoryItem["status"] => {
    if (available === 0) {
      return "OUT_OF_STOCK";
    }

    if (available <= minimumStock) {
      return "LOW_STOCK";
    }

    return "IN_STOCK";
  };
  const handleDamageInventory = ({ id, quantity, }: { id: string; quantity: number; }) => {
    setInventory((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;

        const available = Math.max(
          0,
          item.available - quantity,
        );

        return {
          ...item,
          available,
          damaged: item.damaged + quantity,
          status: calculateStatus(
            available,
            item.minimumStock,
          ),
        };
      }),
    );
  };

  const handleReturnInventory = ({ id, quantity }: { id: string; quantity: number; }) => {
    setInventory((previous) =>
        previous.map((item) => {
            if (item.id !== id) return item;

            const available = item.available + quantity;

            const damaged = Math.max( 0, item.damaged - quantity, );

            return {
                ...item,
                available,
                damaged,
                status: calculateStatus(
                    available,
                    item.minimumStock,
                ),
            };
        }),
    );
  };

  const handleExpireInventory = ({ id, quantity, reason, notes }: { id: string; quantity: number; reason: string; notes: string; }) => {
  // reason and notes will be sent to the backend in Phase 4.
    void reason;
    void notes;

    setInventory((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;

        const available = Math.max( 0, item.available - quantity,);

        return {
          ...item,
          available,
          status: calculateStatus(
            available,
            item.minimumStock,
          ),
        };
      }),
    );
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        minHeight: 500,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
      >
        Inventory
      </Typography>

      <InventoryTable
        items={inventory}
        selected={selectedInventory}
        onSelect={(item) => setSelectedInventoryId(item.id) }
      />

      <InventoryDetailsDrawer
        open={!!selectedInventory}
        inventory={selectedInventory}
        onClose={() => setSelectedInventoryId(null) }
        onAdjust={handleAdjustInventory}
        onTransfer={handleTransferInventory}
        onDamage={handleDamageInventory}
        onReturn={handleReturnInventory}
        onExpire={handleExpireInventory}
      />
    </Paper>
  );
};

export default InventoryPage;