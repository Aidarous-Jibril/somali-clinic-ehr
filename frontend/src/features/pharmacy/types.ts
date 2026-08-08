

import type { ReactNode } from "react";

export type PharmacyTab =
  | "dashboard"
  | "inventory"
  | "purchases"
  | "suppliers"
  | "dispensing";

export interface PharmacyToolbarFilterOption {
  label: string;
  value: string;
}

export interface PharmacyToolbarFilter {
  id: string;
  label: string;
  value: string;
  options: PharmacyToolbarFilterOption[];
}


export interface InventoryItem {
  id: string;

  product: string;
  strength: string;
  formulation: string;

  batch: string;
  expiry: string;

  supplier: string;
  manufacturer: string;

  location: string;

  available: number;
  reserved: number;
  damaged: number;
  minimumStock: number;

  status: | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

export interface PharmacyToolbarAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface PharmacyToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  filters?: ReactNode;

  actions?: PharmacyToolbarAction[];
}