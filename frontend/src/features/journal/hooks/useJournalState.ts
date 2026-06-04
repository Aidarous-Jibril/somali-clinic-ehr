// src/features/journal/hooks/useJournalState.ts
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../../context/AuthContext";
import { usePatient } from "../../../hooks/patient/usePatient";
import { useStaff } from "../../../hooks/staff/useStaff";
import { useUnits } from "../../../hooks/staff/useUnits";
import { useActiveEncounter } from "../../../hooks/encounter/useActiveEncounter";

import {
  getTables,
  createTable,
  getNotes,
  createNote,
  updateNote,
  signNote,
  voidNote,
  deleteNote,
  closeTable,
  reopenTable,
} from "../../../api/journal.api";

import { mapNoteFromApi, mapTableFromApi } from "../mappers";
import { filterNotesByView, matchesSearch } from "../utils";

import type {
  EditorMode,
  JournalCloseReasonKey,
  JournalNote,
  JournalTable,
  JournalViewKey,
} from "../types";
import { buildJournalContent, validateJournalNote } from "../helpers/journal.helpers";
import { JOURNAL_VIEW_TREE } from "../templates/templates";


export function useJournalState() {
  const { patientId = "" } = useParams();
  const { user } = useAuth();

  const { data: patient } = usePatient(patientId);
  const { data: staff = [] } = useStaff();
  const { data: units = [] } = useUnits(patient?.clinicId);
  const { data: activeEncounter } = useActiveEncounter(patientId);

  const encounters = activeEncounter ? [activeEncounter] : [];

  const [tables, setTables] = useState<JournalTable[]>([]);
  const [notes, setNotes] = useState<JournalNote[]>([]);

  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedView, setSelectedView] =
    useState<JournalViewKey>("all_notes");

  const [selectedNoteId, setSelectedNoteId] =
    useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] =
    useState<string | null>(null);

  const [editorMode, setEditorMode] =
    useState<EditorMode>("edit");

  /* ------------Load Tables--------------- */
  async function loadTables() {
    if (!patientId) return;

    const rows = await getTables(patientId);
    let mapped = rows.map(mapTableFromApi);

    if (!mapped.length && activeEncounter?.id) {
      const created = await createTable({
        patientId,
        encounterId: activeEncounter.id,
        title: "Patient Journal",
        unit: activeEncounter.unitName ?? "Current Unit",
      });

      mapped = [mapTableFromApi(created)];
    }

    setTables(mapped);
    setSelectedTableId(mapped[0]?.id ?? "");
  }

  /* -----------Load Notes------------- */
  async function loadNotes(tableId: string) {
    const rows = await getNotes(tableId, patientId);
    setNotes(rows.map(mapNoteFromApi));
  }

  useEffect(() => {
    loadTables();
  }, [patientId, activeEncounter?.id]);

  useEffect(() => {
    if (selectedTableId) {
      loadNotes(selectedTableId);
    }
  }, [selectedTableId]);

  /* ------------- Derived State------------- */
  const selectedTable = useMemo(
    () =>
      tables.find(
        (table) => table.id === selectedTableId
      ) ?? null,
    [tables, selectedTableId]
  );

  const filteredNotes = useMemo(() => {
    return filterNotesByView(notes, selectedView).filter(
      (note) => matchesSearch(note, searchQuery)
    );
  }, [notes, selectedView, searchQuery]);

  const editingNote = useMemo(() => {
    if (!editingNoteId) return null;

    return (
      notes.find(
        (note) => note.id === editingNoteId
      ) ?? null
    );
  }, [notes, editingNoteId]);

  /* -----------Editor---------------- */
  function closeEditor() {
    setIsEditorOpen(false);
    setEditingNoteId(null);
    setEditorMode("edit");
  }

  function updateEditingNote(
    patch: Partial<JournalNote>
  ) {
    if (!editingNoteId) return;

    setNotes((prev) =>
      prev.map((note) =>
        note.id === editingNoteId
          ? { ...note, ...patch }
          : note
      )
    );
  }

  async function openNewNote() {
    if (!selectedTable) return;

    const created = await createNote({
      tableId: selectedTable.id,
      patientId,
      title: "New note",
      content: "",
      encounterId: activeEncounter?.id ?? null,
      unit: user?.unitName ?? selectedTable.unit,
      staffId: user?.id ?? null,
    });

    const mapped: JournalNote = {
      ...mapNoteFromApi(created),

      // force manual selection
      author: "",
      unit: "",
      encounterLabel: "",
    };

    setNotes((prev) => [mapped, ...prev]);
    setSelectedNoteId(mapped.id);
    setEditingNoteId(mapped.id);
    setEditorMode("edit");
    setIsEditorOpen(true);
  }

  async function saveEditingNote(options?: {
    closeAfter?: boolean;
  }) {
    if (!editingNote) return;
    if (!validateJournalNote(editingNote)) return;

    const updated = await updateNote(
      editingNote.id,
      {
        title: editingNote.title,
        content: buildJournalContent(
          editingNote
        ),
        sectionValues:
          editingNote.sectionValues ?? {},

        authorName: editingNote.author,
        unit: editingNote.unit,
        encounterId:
          editingNote.encounterLabel,
        eventDateTime:
          editingNote.eventDateTime,
      }
    );

    const mapped = mapNoteFromApi(updated);

    setNotes((prev) =>
      prev.map((note) =>
        note.id === mapped.id ? mapped : note
      )
    );

    toast.success("Note saved.");

    if (options?.closeAfter) {
      closeEditor();
    }
  }

  async function signEditingNote() {
    if (!editingNote) return;
    if (!validateJournalNote(editingNote)) return;

    await saveEditingNote();

    const row = await signNote(
      editingNote.id
    );

    const mapped = mapNoteFromApi(row);

    setNotes((prev) =>
      prev.map((note) =>
        note.id === mapped.id ? mapped : note
      )
    );

    closeEditor();
    toast.success("Note signed.");
  }

  function openNoteFromCard(id: string) {
    const note = notes.find(
      (item) => item.id === id
    );

    if (!note) return;

    const isLocked =
      selectedTable?.status === "Closed" ||
      note.status === "Signed" ||
      note.status === "Voided";

    setEditingNoteId(id);
    setEditorMode(
      isLocked ? "read" : "edit"
    );
    setIsEditorOpen(true);
  }

  /* ------------Note Actions----------------- */
  async function signExistingNote(id: string) {
    const row = await signNote(id);
    const mapped = mapNoteFromApi(row);

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? mapped : note
      )
    );

    toast.success("Note signed.");
  }

  async function voidExistingNote(
    id: string,
    reason: string
  ) {
    const row = await voidNote(id, reason);
    const mapped = mapNoteFromApi(row);

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? mapped : note
      )
    );

    toast.success("Note voided.");
  }

  async function removeExistingNote(id: string) {
    await deleteNote(id);

    setNotes((prev) =>
      prev.filter((note) => note.id !== id)
    );

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }

    if (editingNoteId === id) {
      closeEditor();
    }

    toast.success("Note deleted.");
  }

  /* ---------- Table Actions ------------- */
  async function closeSelectedTable(
    reason: JournalCloseReasonKey,
    comment: string
  ) {
    if (!selectedTable) return;

    const row = await closeTable(
      selectedTable.id,
      reason,
      comment
    );

    const mapped = mapTableFromApi(row);

    setTables((prev) =>
      prev.map((table) =>
        table.id === mapped.id
          ? mapped
          : table
      )
    );

    closeEditor();
    toast.success(
      "Journal table closed."
    );
  }

  async function reopenSelectedTable() {
    if (!selectedTable) return;

    const row = await reopenTable(
      selectedTable.id
    );

    const mapped = mapTableFromApi(row);

    setTables((prev) =>
      prev.map((table) =>
        table.id === mapped.id
          ? mapped
          : table
      )
    );

    toast.success(
      "Journal table reopened."
    );
  }

  /* -----------Public API  ------------- */
  return {
    viewTree: JOURNAL_VIEW_TREE,

    tables,
    selectedTable,
    selectedTableId,
    setSelectedTableId,

    selectedView,
    setSelectedView,

    searchQuery,
    setSearchQuery,

    filteredNotes,
    selectedNoteId,
    setSelectedNoteId,

    isEditorOpen,
    editingNote,
    editorMode,

    encounters,
    staff,
    units,

    openNewNote,
    openNoteFromCard,
    closeEditor,
    updateEditingNote,
    saveEditingNote,
    signEditingNote,

    signNote: signExistingNote,
    voidNote: voidExistingNote,
    deleteNote: removeExistingNote,

    closeSelectedTable,
    reopenSelectedTable,
  };
}