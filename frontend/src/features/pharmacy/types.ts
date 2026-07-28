// src/features/pharmacy/types.ts

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

export interface PharmacyToolbarAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}