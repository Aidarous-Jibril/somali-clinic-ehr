
import * as repo from "./journal.repository.js";
import { prisma } from "../../config/prisma.js";

export const createJournalTable = async (input: any, user: any) => {
  const encounter = await prisma.encounter.findUnique({
    where: {
      id: input.encounterId,
    },
  });

  if (!encounter) throw new Error("Encounter not found");
  
  if (encounter.clinicId !== user!.clinicId) throw new Error("Forbidden encounter");
  
  if (encounter.patientId !== input.patientId) throw new Error( "Encounter does not belong to patient" );

  return repo.createTable({
    clinicId: user!.clinicId,
    patientId: input.patientId,
    encounterId: input.encounterId,
    title: input.title,
    unit: input.unit,
    status: "open",
  });
};

export const listTables = (query: any) => {
  return repo.findTables({
    clinicId: query.clinicId,
    patientId: query.patientId,
  });
};

export const listNotes = (query: any) => {
  const filters: any = {
    clinicId: query.clinicId,
    tableId: query.tableId,
  };

  if (query.patientId) {
    filters.patientId = query.patientId;
  }

  return repo.findNotes(filters);
};

export const createNote = async (input: any, user: any) => {
  const table = await repo.findTableById(input.tableId);

  if (!table) throw new Error("Journal table not found");

  if (table.clinicId !== user.clinicId) throw new Error("Forbidden");

  if (table.patientId !== input.patientId) throw new Error("Table does not belong to patient");

  if (table.status !== "open") throw new Error("Journal table is closed");

  const person = await prisma.staffPerson.findUnique({
    where: { id: user.personId, },
  });

  if (!person) throw new Error("Staff person not found");

  return repo.createNote({
    tableId: input.tableId,
    patientId: input.patientId,
    clinicId: user.clinicId,
    title: input.title,
    content: input.content,
    unit: input.unit,

    authorId: user.accountId,
    authorName: `${person.firstName} ${person.lastName}`,

    status: "draft",
    eventDateTime: new Date(),
  });
};

export const saveNote =  async (id: string, input: any, user: any) => {
  const note = await repo.findNoteById(id);
  if (!note) throw new Error("Note not found");
  
  if (note.clinicId !== user!.clinicId) throw new Error("Forbidden");

  if (note.status !== "draft") throw new Error( "Only drafts can be edited");

  return repo.updateNote(id, input);
};

export const signNote = async (id: string, user: any) => {
  const note = await repo.findNoteById(id);

  if (!note) throw new Error("Note not found");

  if (note.clinicId !== user!.clinicId) throw new Error("Forbidden");

  if (note.status !== "draft") throw new Error( "Only drafts can be signed" );

  return repo.updateNote(id, {
    status: "signed",
    signedAt: new Date(),
  });
};

export const voidNote = async ( id: string, reason: string, user: any ) => { 
  const note = await repo.findNoteById(id);

  if (!note) throw new Error("Note not found");
  
  if (note.clinicId !== user!.clinicId) throw new Error("Forbidden");
  
  if (note.status === "voided") throw new Error("Already voided");

  return repo.updateNote(id, {
    status: "voided",
    voidReason: reason,
    voidedAt: new Date(),
  });
};

export const removeNote = async ( id: string, user: any ) => {
  const note = await repo.findNoteById(id);

  if (!note) throw new Error("Note not found");

  if (note.clinicId !== user!.clinicId) throw new Error("Forbidden");
  
  if (note.status === "signed") throw new Error( "Signed notes cannot be deleted");

  return repo.deleteNote(id);
};

export const closeTable = async ( id: string, reason: string, comment: string,  user: any ) => {
  const table = await repo.findTableById(id);
  if (!table) throw new Error("Table not found");

  if (table.clinicId !== user!.clinicId) throw new Error("Forbidden");

  return repo.updateTable(id, {
    status: "closed",
    closeReason: reason,
    closeComment: comment,
    closedAt: new Date(),
    closedByStaffId: user!.accountId,
  });
};

export const reopenTable = async ( id: string, user: any ) => {
  const table = await repo.findTableById(id);

  if (!table) throw new Error("Table not found");

  if (table.clinicId !== user!.clinicId) throw new Error("Forbidden");

  return repo.updateTable(id, {
    status: "open",
    closeReason: null,
    closeComment: null,
    closedAt: null,
    closedByStaffId: null,
  });
};