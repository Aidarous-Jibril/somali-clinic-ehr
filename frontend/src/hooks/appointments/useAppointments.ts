// src/features/appointments/hooks/useAppointments.ts

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { arrivedAppointment, completeAppointment, getAppointments, startAppointment, cancelAppointment } from "../../api/appointments";
import type { Appointment } from "../../features/appointments/types";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAppointments();
      setAppointments(res.data);
    } catch (err) {
      toast.error("Failed to fetch appointments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleError = (err: any, fallback: string) => {
    toast.error(err?.response?.data?.message || fallback);
  };

  const markArrived = async (id: string) => {
    try {
      await arrivedAppointment(id);
      fetchAppointments();
    } catch (err) {
      handleError(err, "Failed to mark arrived");
    }
  };

  const start = async (id: string) => {
    try {
      await startAppointment(id);
      fetchAppointments();
    } catch (err) {
      handleError(err, "Not allowed to start");
    }
  };

  const complete = async (id: string) => {
    try {
      await completeAppointment(id);
      fetchAppointments();
    } catch (err) {
      handleError(err, "Not allowed to complete");
    }
  };

  const cancel = async (id: string) => {
  try {
    await cancelAppointment(id);
    fetchAppointments();
  } catch (err) {
    handleError(err, "Failed to cancel");
  }
};
  return {
    appointments,
    loading,
    markArrived,
    start,
    complete,
    cancel,
    refetch: fetchAppointments,
  };
};