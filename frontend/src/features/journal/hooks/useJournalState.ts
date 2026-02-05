import { useMemo, useState } from "react";

import {
  initialJournalNotes,
  initialJournalTables,
  JOURNAL_VIEW_TREE,
} from "../mockData";

import type {
  EditorMode,
  JournalCloseReasonKey,
  JournalNote,
  JournalTable,
  JournalViewKey,
} from "../types";

import { filterNotesByView, matchesSearch } from "../utils";
import { JOURNAL_TEMPLATES } from "../templates/templates";

/* Helpers (pure, local to this hook) */

/** Create a simple unique ID for notes */
function makeId(prefix = "note") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

/**
 * Build final note content from a selected template + section values.
 * Falls back to free-text content if no template is used.
 */
function buildContentFromTemplate(note: JournalNote) {
  const template = note.templateId
    ? JOURNAL_TEMPLATES.find((t) => t.id === note.templateId)
    : undefined;

  if (!template) return (note.content ?? "").trim();

  const sectionValues = note.sectionValues ?? {};

  return template.sections
    .map((s) => {
      const value = (sectionValues[s.key] ?? "").trim();
      return value ? `${s.label}:\n${value}` : "";
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

/* Journal state hook */

export function useJournalState() {
  /* View & filter state */
  const [selectedView, setSelectedView] =
    useState<JournalViewKey>("all_notes");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  /* Core data state */

  const [notes, setNotes] =
    useState<JournalNote[]>(initialJournalNotes);

  const [tables, setTables] =
    useState<JournalTable[]>(initialJournalTables);

  const [selectedTableId, setSelectedTableId] = useState(
    initialJournalTables[0]?.id ?? ""
  );

  /* Editor state */

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");

  /* UI feedback */

  const [toast, setToast] = useState<string | null>(null);

  /* Derived state */

  /** Currently selected journal table */
  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId) ?? null,
    [tables, selectedTableId]
  );

  /** Notes filtered by table, view, and search */
  const filteredNotes = useMemo(() => {
    const byTable = notes.filter((n) => n.tableId === selectedTableId);
    const byView = filterNotesByView(byTable, selectedView);
    return byView.filter((n) => matchesSearch(n, searchQuery));
  }, [notes, selectedTableId, selectedView, searchQuery]);

  /**
   * Ensure a valid selected note:
   * - Keep current if still visible
   * - Otherwise fallback to first filtered note
   */
  const effectiveSelectedNoteId = useMemo(() => {
    if (!filteredNotes.length) return null;
    if (selectedNoteId && filteredNotes.some((n) => n.id === selectedNoteId)) {
      return selectedNoteId;
    }
    return filteredNotes[0].id;
  }, [filteredNotes, selectedNoteId]);

  /** Currently edited note (if any) */
  const editingNote = useMemo(
    () =>
      editingNoteId
        ? notes.find((n) => n.id === editingNoteId) ?? null
        : null,
    [notes, editingNoteId]
  );

  /* Editor lifecycle */

  function closeEditor() {
    setIsEditorOpen(false);
    setEditingNoteId(null);
    setEditorMode("edit");
  }

  function openNewNote() {
    if (!selectedTable || selectedTable.status !== "Open") {
      setToast("Journal table is closed. Reopen it to document.");
      window.setTimeout(() => setToast(null), 2500);
      return;
    }

    const now = new Date();
    const id = makeId("note");

    const draft: JournalNote = {
      id,
      tableId: selectedTable.id,
      type: "progress_note",
      title: "New note",
      dateTime: now.toISOString(),
      author: "Current user",
      unit: selectedTable.unit,
      status: "Draft",
      content: "",
    };

    setNotes((prev) => [draft, ...prev]);
    setEditingNoteId(id);
    setEditorMode("edit");
    setIsEditorOpen(true);
    setSelectedNoteId(id);
  }

  /** Open note for read or edit depending on status & table */
  function openNoteFromCard(id: string) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    const table = tables.find((t) => t.id === note.tableId);
    const tableOpen = table?.status === "Open";

    setEditingNoteId(id);
    setIsEditorOpen(true);

    if (note.status === "Draft" && tableOpen) setEditorMode("edit");
    else setEditorMode("read");
  }

  function updateEditingNote(patch: Partial<JournalNote>) {
    if (!editingNoteId || editorMode === "read") return;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingNoteId ? { ...n, ...patch } : n
      )
    );
  }

  function saveEditingNote({ closeAfter }: { closeAfter?: boolean } = {}) {
    if (!editingNoteId || editorMode === "read") return;

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== editingNoteId) return n;

        const content = buildContentFromTemplate(n);
        const template = n.templateId
          ? JOURNAL_TEMPLATES.find((t) => t.id === n.templateId)
          : undefined;

        return {
          ...n,
          title: template ? template.label : n.title,
          content,
          dateTime: new Date().toISOString(),
        };
      })
    );

    setToast("Note saved.");
    window.setTimeout(() => setToast(null), 2500);

    if (closeAfter) closeEditor();
  }

  function signEditingNote() {
    if (!editingNoteId || editorMode === "read") return;

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== editingNoteId) return n;

        const content = buildContentFromTemplate(n);
        const template = n.templateId
          ? JOURNAL_TEMPLATES.find((t) => t.id === n.templateId)
          : undefined;

        return {
          ...n,
          title: template ? template.label : n.title,
          content,
          dateTime: new Date().toISOString(),
          status: "Signed",
        };
      })
    );

    setToast("Note signed.");
    window.setTimeout(() => setToast(null), 2500);
    closeEditor();
  }

  /* Note actions */

  function signNote(id: string) {
    const now = new Date().toISOString();

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id || n.status !== "Draft") return n;

        const content = buildContentFromTemplate(n);
        const template = n.templateId
          ? JOURNAL_TEMPLATES.find((t) => t.id === n.templateId)
          : undefined;

        return {
          ...n,
          title: template ? template.label : n.title,
          content,
          dateTime: now,
          status: "Signed",
        };
      })
    );

    setToast("Note signed.");
    window.setTimeout(() => setToast(null), 2500);

    if (editingNoteId === id) closeEditor();
  }

  function voidNote(id: string, reason: string) {
    const now = new Date().toISOString();

    setNotes((prev) =>
      prev.map((n) =>
        n.id !== id
          ? n
          : {
              ...n,
              status: "Voided",
              voidedAt: now,
              voidReason: reason.trim() || "No reason specified",
              dateTime: now,
            }
      )
    );

    setToast("Note cancelled (voided).");
    window.setTimeout(() => setToast(null), 2500);

    if (editingNoteId === id) closeEditor();
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedNoteId((prev) => (prev === id ? null : prev));

    setToast("Note deleted.");
    window.setTimeout(() => setToast(null), 2500);

    if (editingNoteId === id) closeEditor();
  }

  /* Journal table lifecycle */

  function closeSelectedTable(
    reason: JournalCloseReasonKey,
    comment: string
  ) {
    if (!selectedTable || selectedTable.status !== "Open") return;

    const now = new Date().toISOString();

    setTables((prev) =>
      prev.map((t) =>
        t.id !== selectedTable.id
          ? t
          : {
              ...t,
              status: "Closed",
              closedAt: now,
              closeReason: reason,
              closeComment: comment,
            }
      )
    );

    setToast("Journal table closed.");
    window.setTimeout(() => setToast(null), 2500);

    if (editingNoteId) {
      const n = notes.find((x) => x.id === editingNoteId);
      if (n?.tableId === selectedTable.id) closeEditor();
    }
  }

  function reopenSelectedTable() {
    if (!selectedTable || selectedTable.status !== "Closed") return;

    setTables((prev) =>
      prev.map((t) =>
        t.id !== selectedTable.id
          ? t
          : {
              ...t,
              status: "Open",
              closedAt: undefined,
              closeReason: undefined,
              closeComment: undefined,
            }
      )
    );

    setToast("Journal table reopened. You can document again.");
    window.setTimeout(() => setToast(null), 2500);
  }

  /* Public API*/

  return {
    viewTree: JOURNAL_VIEW_TREE,

    selectedView,
    setSelectedView,
    searchQuery,
    setSearchQuery,

    filteredNotes,
    selectedNoteId: effectiveSelectedNoteId,
    setSelectedNoteId,

    isEditorOpen,
    editingNote,
    editorMode,
    toast,

    openNewNote,
    openNoteFromCard,
    closeEditor,
    updateEditingNote,
    saveEditingNote,
    signEditingNote,

    voidNote,
    deleteNote,
    signNote,

    tables,
    selectedTable,
    selectedTableId,
    setSelectedTableId,
    closeSelectedTable,
    reopenSelectedTable,
  };
}
