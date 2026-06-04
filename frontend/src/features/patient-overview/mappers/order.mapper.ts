// src/features/patient-overview/mappers/order.mapper.ts
import type { Order } from "../types";

export const mapOrderToUi = (o: any): Order => {
  const orderedAt = o.orderedAt ? new Date(o.orderedAt) : null;

  return {
    id: o.id,
    category: capitalize(o.category),
    name: o.name,

    // main date used in table
    date: orderedAt ? orderedAt.toISOString().slice(0, 10) : "",

    // full datetime for header
    dateTime: o.orderedAt,

    // 👇 NEW — requester for dialog
    requester: o.orderedByStaff?.name ?? "",

    // 👇 NEW — planned date (phase 1 = same as ordered date)
    plannedDate: orderedAt ? orderedAt.toISOString().slice(0, 10) : "",

    // label in widget
    orderedBy: o.orderedByStaff
      ? `${o.orderedByStaff.name} (${o.orderedByStaff.role})`
      : "",

    orderedByStaffId: o.orderedByStaffId,
    status: o.status,
    openLabel: "Open order",
  };
};

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
