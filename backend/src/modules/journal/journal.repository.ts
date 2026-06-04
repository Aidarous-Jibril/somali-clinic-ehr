import { prisma } from "../../config/prisma.js";

export const createTable = (data: any) => {
  return prisma.journalTable.create({
    data,
    include: {
      patient: true,
    },
  });
};

export const createNote = (data: any) => {
  return prisma.journalNote.create({
    data,
  });
};

export const updateNote = ( id: string, data: any ) => {
  return prisma.journalNote.update({
    where: { id },
    data,
    include: {
      table: true,
    },
  });
};

export const deleteNote = (id: string) => {
  return prisma.journalNote.delete({
    where: { id },
  });
};

export const findNoteById = (id: string) => {
  return prisma.journalNote.findUnique({
    where: { id },
  });
};

export const findNotes = (filters: any) => {
  return prisma.journalNote.findMany({
    where: filters,
    orderBy: {
      eventDateTime: "desc",
    },
  });
};

export const findTables = (filters: any) => {
  return prisma.journalTable.findMany({
    where: filters,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findTableById = (id: string) => {
  return prisma.journalTable.findUnique({
    where: { id },
  });
};

export const updateTable = ( id: string, data: any) => {
  return prisma.journalTable.update({
    where: { id },
    data,
  });
};