// src/utils/dateFormat.ts
import dayjs from "dayjs";

export const formatDateTime = (iso?: string | null) => {
  if (!iso) return "-";
  return dayjs(iso).format("YYYY-MM-DD HH:mm");
};

export const formatTime = (iso?: string | null) => {
  if (!iso) return "--:--";
  return dayjs(iso).format("HH:mm");
};

export const formatLongDate = (date: Date) => {
  return dayjs(date).format("dddd, MMMM D, YYYY");
};

export const addDays = (date: Date, days: number) => {
  return dayjs(date).add(days, "day").toDate();
};

export const toLocalInputValue = (iso?: string | null) => {
  if (!iso) return "";
  return dayjs(iso).format("YYYY-MM-DDTHH:mm");
};

export const fromLocalInputValue = (value: string) => {
  if (!value) return "";
  return dayjs(value).toISOString();
};