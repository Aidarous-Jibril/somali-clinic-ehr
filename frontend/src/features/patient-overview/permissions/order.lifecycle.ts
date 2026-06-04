import type { Order } from "../types";
import type { AuthUser } from "../../../context/AuthContext";

const isDoctor = (user?: AuthUser | null) =>
  user?.role === "Doctor";

const isLabStaff = (user?: AuthUser | null) =>
  user?.role === "Lab" ||
  user?.role === "Radiology" ||
  user?.role === "Nurse";

// LAB ONLY
export const canStartOrder = (order: Order, user?: AuthUser | null) =>
  isLabStaff(user) && order.status === "ordered";

export const canResultOrder = (order: Order, user?: AuthUser | null) =>
  isLabStaff(user) && order.status === "in_progress";

// DOCTOR ONLY
export const canReviewOrder = (order: Order, user?: AuthUser | null) =>
  isDoctor(user) && order.status === "resulted";

export const canCompleteOrder = (order: Order, user?: AuthUser | null) =>
  isDoctor(user) && order.status === "reviewed";