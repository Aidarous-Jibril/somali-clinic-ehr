// src/features/pharmacy/constants.ts

import type { InventoryItem, PharmacyTab } from "./types";


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

export const DEFAULT_PHARMACY_TAB: PharmacyTab = "dashboard";

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

export const mockPendingPurchases = [
  {
    id: "1",
    supplier: "MediSupply Ltd",
    poNumber: "PO-24081",
    expected: "2026-08-04",
    status: "Ordered",
  },
  {
    id: "2",
    supplier: "Global Pharma",
    poNumber: "PO-24079",
    expected: "2026-08-01",
    status: "Partially Received",
  },
  {
    id: "3",
    supplier: "Somali Medical",
    poNumber: "PO-24074",
    expected: "2026-07-30",
    status: "Delayed",
  },
];

export const mockInventory: InventoryItem[] = [
  {
    id: "1",
    product: "Paracetamol",
    strength: "500 mg",
    formulation: "Tablet",
    batch: "PAR-2401",
    expiry: "2027-01-15",
    available: 84,
    reserved: 6,
    damaged: 0,
    minimumStock: 20,
    supplier: "MediSupply",
    manufacturer: "Acme Pharma",
    location: "Main Store",
    status: "IN_STOCK",
  },
  {
    id: "2",
    product: "Amoxicillin",
    strength: "250 mg",
    formulation: "Tablet",
    batch: "AMX-1031",
    expiry: "2026-08-12",
    available: 12,
    reserved: 2,
    damaged: 1,
    minimumStock: 20,
    supplier: "Global Pharma",
    manufacturer: "Acme Pharma",
    location: "Shelf A2",
    status: "LOW_STOCK",
  },
  {
    id: "3",
    product: "Vitamin C",
    strength: "500 mg",
    formulation: "Tablet",
    batch: "VIT-8892",
    expiry: "2026-07-30",
    available: 0,
    reserved: 0,
    damaged: 6,
    minimumStock: 10,
    supplier: "Somali Medical",
    manufacturer: "Acme Pharma",
    location: "Shelf C1",
    status: "OUT_OF_STOCK",
  },
];

export  const locations = [ "Ward Pharmacy", "Emergency Room", "ICU", "Operating Theatre", "Satellite Pharmacy",];
export const adjustmentReasons = [ "Stock Received", "Inventory Count", "Correction", "Manual Adjustment", "Other", ];

export const damageReasons = [ "Broken Package", "Expired", "Contaminated", "Storage Damage", "Manufacturer Defect", "Other", ];
export const returnReasons = [ "Quality Inspection", "Packaging Corrected", "Marked Damaged by Mistake", "Manufacturer Approval", "Other", ];
export const expireReasons = [ "Expired", "Manufacturer Recall", "Quality Failure", "Cold Chain Failure", "Storage Damage", "Other", ];