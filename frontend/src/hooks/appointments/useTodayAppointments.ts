// src/hooks/useTodayAppointments.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";

export const useTodayAppointments = (date?: Date) => {
  return useQuery({
    queryKey: ["appointments", "today", date?.toISOString()],

    queryFn: async () => {
      const res = await api.get("/appointments/today", {
        params: date
          ? { date: date.toISOString() }
          : undefined,
      });

      return res.data;
    },
  });
};