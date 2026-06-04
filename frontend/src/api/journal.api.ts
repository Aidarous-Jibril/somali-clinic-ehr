// src/features/journal/api/journal.api.ts

import { api } from "./client";

/* ---------------- TABLES ---------------- */
export const getTables = async (patientId: string) => {
  const res = await api.get("/journal/tables", {
    params: { patientId },
  });

  return res.data;
};

export const createTable = async (payload: {
  patientId: string;
  encounterId?: string | null;
  title: string;
  unit: string;
}) => {
  const res = await api.post("/journal/tables", payload);
  return res.data;
};

export const closeTable = async (
  id: string,
  reason: string,
  comment: string
) => {
  const res = await api.post(`/journal/tables/${id}/close`, {
    reason,
    comment,
  });

  return res.data;
};

export const reopenTable = async (id: string) => {
  const res = await api.post(`/journal/tables/${id}/reopen`);
  return res.data;
};

/* ---------------- NOTES ---------------- */
export const getNotes = async (tableId: string, patientId: string) => {
  const res = await api.get("/journal/notes", {
    params: {
      tableId,
      patientId,
    },
  });

  return res.data;
};

export const createNote = async (payload: any) => {
  const res = await api.post("/journal/notes", payload);
  return res.data;
};

export const updateNote = async (id: string, payload: any) => {
  const res = await api.patch(`/journal/notes/${id}`, payload);
  return res.data;
};

export const signNote = async (id: string) => {
  const res = await api.post(`/journal/notes/${id}/sign`);
  return res.data;
};

export const voidNote = async (id: string, reason: string) => {
  const res = await api.post(`/journal/notes/${id}/void`, { reason });
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete(`/journal/notes/${id}`);
  return res.data;
};