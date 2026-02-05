// src/components/patient-overview/OrdersWidget.tsx
import React, { useMemo, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

import type { Order, OrderCategoryGroup } from "../../features/patient-overview/types";
import { ORDER_CATEGORY_PREFERENCE } from "../../features/patient-overview/mockData";


/* ================= PROPS ==================== */
type OrdersWidgetProps = {
  orders: Order[];
  onAddClick?: () => void;
  onOpenOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
};

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
export const OrdersWidget: React.FC<OrdersWidgetProps> = ({
  orders,
  onAddClick,
  onOpenOrder,
  onEditOrder,
}) => {

/* --------- Derived data -------- */
  const groups = useMemo(() => groupOrdersByCategory(orders), [orders]);

  /* --------- State -------- */
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach((g) => (initial[g.category] = true));
    return initial;
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  /* --------- Handlers -------- */
  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  /* --------- Render -------- */
  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <span className="text-[13px] font-semibold">Orders</span>

        <div className="flex items-center gap-2">
          <button className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-[11px] hover:bg-gray-100">
            My unit
          </button>

          {onAddClick && (
            <Tooltip title="New order">
              <IconButton size="small" sx={{ color: "#1d4ed8" }} onClick={onAddClick}>
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </header>

      {/* Selected order panel */}
      {selectedOrder && (
        <div className="border-b border-gray-200 bg-white px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[13px] font-semibold">{selectedOrder.name}</div>
            <IconButton size="small" onClick={() => setSelectedOrderId(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600">
            <span>{selectedOrder.dateTime ?? selectedOrder.date}</span>
            <span>{selectedOrder.orderedBy}</span>

            <div className="ml-auto flex items-center gap-3">
              {onEditOrder && (
                <button
                  type="button"
                  className="text-[11px] font-medium text-blue-700 hover:underline"
                  onClick={() => onEditOrder(selectedOrder)}
                >
                  Edit
                </button>
              )}

              <button
                type="button"
                className="text-[11px] font-medium text-blue-700 hover:underline"
                onClick={() => onOpenOrder?.(selectedOrder)}
              >
                {selectedOrder.openLabel ?? "Open order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders list */}
      <div className="px-3 py-2">
        <div className="grid grid-cols-[1.2fr_1fr_0.8fr] gap-2 border-b border-gray-100 pb-1 text-[10px] uppercase tracking-wide text-gray-500">
          <div>Analysis</div>
          <div>Ordered by</div>
          <div>Date</div>
        </div>

        <div className="max-h-72 overflow-auto">
          {groups.length === 0 ? (
            <div className="py-3 text-[11px] text-gray-500">No orders.</div>
          ) : (
            groups.map((group) => {
              const isOpen = expanded[group.category];

              return (
                <div key={group.category} className="border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => toggleCategory(group.category)}
                    className="flex w-full items-center gap-2 bg-gray-50 px-2 py-2 text-left text-[11px] font-semibold hover:bg-gray-100"
                  >
                    <span className={"transition-transform " + (isOpen ? "rotate-90" : "")}>
                      ▶
                    </span>
                    {group.category} ({group.items.length})
                  </button>

                  {isOpen &&
                    group.items.map((order) => (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className={
                          "grid w-full grid-cols-[1.2fr_1fr_0.8fr] gap-2 px-2 py-2 text-left text-[11px] hover:bg-blue-50 " +
                          (order.id === selectedOrderId ? "bg-blue-50" : "bg-white")
                        }
                      >
                        <div className="truncate">{order.name}</div>
                        <div className="truncate text-gray-600">{order.orderedBy}</div>
                        <div className="truncate text-gray-600">{order.date}</div>
                      </button>
                    ))}
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 text-center text-[11px] text-gray-400">
          Unanswered orders are displayed for 3 months after the scheduled sampling date has passed.
        </div>
      </div>
    </section>
  );
};
