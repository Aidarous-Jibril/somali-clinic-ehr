// src/features/pharmacy/constants.ts

import type { PharmacyTab } from "./types";


export const PHARMACY_TABS: {
  value: PharmacyTab;
  label: string;
}[] = [
  {
    value: "dashboard",
    label: "Dashboard",
  },
  {
    value: "inventory",
    label: "Inventory",
  },
  {
    value: "purchases",
    label: "Purchases",
  },
  {
    value: "suppliers",
    label: "Suppliers",
  },
  {
    value: "dispensing",
    label: "Dispensing",
  },
];


// MOCK DATA
// src/features/pharmacy/constants.ts


export const DEFAULT_PHARMACY_TAB: PharmacyTab = "dashboard";

// export const PHARMACY_TABS = [
//   { value: "dashboard", label: "Dashboard" },
//   { value: "inventory", label: "Inventory" },
//   { value: "purchases", label: "Purchases" },
//   { value: "suppliers", label: "Suppliers" },
//   { value: "dispensing", label: "Dispensing" },
// ] as const;

export const mockDashboardStats = {
  totalProducts: 248,
  lowStock: 14,
  expiringSoon: 7,
  pendingPurchases: 5,
};

export const mockLowStock = [
  {
    id: "1",
    product: "Paracetamol 500mg",
    stock: 4,
    minimum: 20,
    status: "Low",
  },
  {
    id: "2",
    product: "Amoxicillin 250mg",
    stock: 2,
    minimum: 15,
    status: "Critical",
  },
  {
    id: "3",
    product: "Ibuprofen 400mg",
    stock: 6,
    minimum: 10,
    status: "Low",
  },
];


export const mockExpiringInventory = [
  {
    id: "1",
    product: "Insulin Pen",
    batch: "INS-24001",
    expiry: "2026-08-15",
    daysRemaining: 18,
    status: "Soon",
  },
  {
    id: "2",
    product: "Vitamin C",
    batch: "VIT-7782",
    expiry: "2026-08-08",
    daysRemaining: 11,
    status: "Urgent",
  },
  {
    id: "3",
    product: "Amoxicillin 500mg",
    batch: "AMX-6611",
    expiry: "2026-08-20",
    daysRemaining: 23,
    status: "Soon",
  },
];

export const mockRecentMovements = [
  {
    id: "1",
    product: "Paracetamol 500mg",
    type: "Dispensed",
    quantity: -2,
    time: "09:42",
  },
  {
    id: "2",
    product: "Insulin Pen",
    type: "Received",
    quantity: 50,
    time: "09:05",
  },
  {
    id: "3",
    product: "Vitamin C",
    type: "Adjusted",
    quantity: -4,
    time: "Yesterday",
  },
];

export const mockPendingDispensing = [
  {
    id: "1",
    patient: "Ali Mohamed",
    medication: "Paracetamol 500mg",
    quantity: "20 tabs",
    status: "Pending",
  },
  {
    id: "2",
    patient: "Fatima Yusuf",
    medication: "Amoxicillin 250mg",
    quantity: "14 caps",
    status: "Ready",
  },
  {
    id: "3",
    patient: "Ahmed Hassan",
    medication: "Insulin Pen",
    quantity: "2 pens",
    status: "In Progress",
  },
];