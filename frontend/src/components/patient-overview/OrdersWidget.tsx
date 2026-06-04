// src/components/patient-overview/
import React, { useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { Order, OrderCategoryGroup } from "../../features/patient-overview/types";
import { ORDER_CATEGORY_PREFERENCE } from "../../features/patient-overview/mockData";
import { useAuth } from "../../context/AuthContext";

import { canEditOrder } from "../../features/patient-overview/permissions/order.permissions";
import {
  canStartOrder,
  canResultOrder,
  canReviewOrder,
  canCompleteOrder,
} from "../../features/patient-overview/permissions/order.lifecycle";

import { useOrderLifecycle } from "../../hooks/orders/useOrderLifecycle";
import { ResultDialog } from "../../features/patient-overview/dialogs/ResultDialog";
import { AddButton } from "./common/AddButton";

/* ================= HELPERS ==================== */
const groupOrdersByCategory = (orders: Order[]): OrderCategoryGroup[] => {
  const map = new Map<string, Order[]>();

  for (const order of orders) {
    const category = order.category || "Other";
    map.set(category, [...(map.get(category) ?? []), order]);
  }

  const keys = Array.from(map.keys());

  keys.sort((a, b) => {
    const ia = ORDER_CATEGORY_PREFERENCE.indexOf(a);
    const ib = ORDER_CATEGORY_PREFERENCE.indexOf(b);

    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    }

    return a.localeCompare(b);
  });

  return keys.map((key) => ({
    category: key,
    items: map.get(key) ?? [],
  }));
};

/* ================= COMPONENT ==================== */

type OrdersWidgetProps = {
  orders: Order[];
  encounterId: string;
  patientId: string;
  onAddClick?: () => void;
  onOpenOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
};

export const OrdersWidget: React.FC<OrdersWidgetProps> = ({
  orders,
  encounterId,
  patientId,
  onAddClick,
  onEditOrder,
}) => {
  const { user } = useAuth();
  const lifecycle = useOrderLifecycle(encounterId, patientId);

  const groups = useMemo(() => groupOrdersByCategory(orders), [orders]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <span className="text-[13px] font-semibold">Orders</span>

        {onAddClick && (
          <AddButton
            onClick={onAddClick}
            title="New order"
          />
        )}
      </header>

      {/* SELECTED ORDER PANEL */}
      {selectedOrder && (
        <div className="border-b border-gray-200 bg-white px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[13px] font-semibold">{selectedOrder.name}</div>
            <IconButton size="small" onClick={() => setSelectedOrderId(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600">
            <span>{selectedOrder.date}</span>
            <span>{selectedOrder.orderedBy}</span>
            <span className="font-semibold">{selectedOrder.status}</span>

            <div className="ml-auto flex items-center gap-3">
              {onEditOrder && canEditOrder(selectedOrder, user) && (
                <button
                  className="text-[11px] font-medium text-blue-700 hover:underline"
                  onClick={() => onEditOrder(selectedOrder)}
                >
                  Edit
                </button>
              )}

              {canStartOrder(selectedOrder, user) && (
                <button
                  className="text-[11px] font-medium text-green-700"
                  onClick={() => lifecycle.start.mutate(selectedOrder.id)}
                >
                  Start
                </button>
              )}

              {canResultOrder(selectedOrder, user) && (
                <button
                  className="text-[11px] font-medium text-green-700"
                  onClick={() => setResultDialogOpen(true)}
                >
                  Result
                </button>
              )}

              {canReviewOrder(selectedOrder, user) && (
                <button
                  className="text-[11px] font-medium text-green-700"
                  onClick={() => lifecycle.review.mutate(selectedOrder.id)}
                >
                  Review
                </button>
              )}

              {canCompleteOrder(selectedOrder, user) && (
                <button
                  className="text-[11px] font-medium text-green-700"
                  onClick={() => lifecycle.complete.mutate(selectedOrder.id)}
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ORDER LIST */}
      <div className="px-3 py-2">
        {groups.map((group) => (
          <div key={group.category} className="border-b border-gray-100">
            <button
              onClick={() => toggleCategory(group.category)}
              className="flex w-full items-center gap-2 bg-gray-50 px-2 py-2 text-left text-[11px] font-semibold hover:bg-gray-100"
            >
              ▶ {group.category} ({group.items.length})
            </button>

            {(expanded[group.category] ?? true) &&
              group.items.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className="grid w-full grid-cols-[1.2fr_1fr_0.8fr] gap-2 px-2 py-2 text-left text-[11px] hover:bg-blue-50"
                >
                  <div className="truncate">{order.name}</div>
                  <div className="truncate text-gray-600">{order.orderedBy}</div>
                  <div className="truncate text-gray-600">{order.date}</div>
                </button>
              ))}
          </div>
        ))}
      </div>

      {/* RESULT DIALOG */}
      {selectedOrder && (
        <ResultDialog
          open={resultDialogOpen}
          onClose={() => setResultDialogOpen(false)}
          onSave={(payload) => {
            lifecycle.result.mutate({
              id: selectedOrder.id,
              payload,
            });
            setResultDialogOpen(false);
          }}
        />
      )}
    </section>
  );
};