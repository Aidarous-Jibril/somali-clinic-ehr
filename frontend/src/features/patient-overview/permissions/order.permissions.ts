// src/features/patient-overview/permissions/order.lifecycle.ts

import type { Order } from "../types";
import type { AuthUser } from "../../../context/AuthContext";


// -------------- ROLE HELPERS ---------------//

const isDoctor = (user?: AuthUser | null) => user?.role === "Doctor";

const isNurse = (user?: AuthUser | null) => user?.role === "Nurse";

const isLabStaff = (user?: AuthUser | null) => user?.role === "Radiology" || user?.role === "Lab";

const isCreator = (order: Order, user?: AuthUser | null) =>
  order.orderedByStaffId === user?.id;

// --------------DOCTOR / NURSE (CREATION PHASE) ---------------//
export const canEditOrder = (order: Order, user?: AuthUser | null) => isCreator(order, user) && order.status === "ordered";


// -------------LAB WORKFLOW  (FIXED HERE)----------------//
export const canResultOrder = (order: Order, user?: AuthUser | null) => isLabStaff(user) && order.status === "in_progress";  


// --------  DOCTOR REVIEW PHASE -----------//
export const canReviewOrder = (order: Order, user?: AuthUser | null) => isDoctor(user) && order.status === "resulted";

export const canCompleteOrder = (order: Order, user?: AuthUser | null) => isDoctor(user) && order.status === "reviewed";