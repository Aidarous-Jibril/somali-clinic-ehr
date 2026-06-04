// src/components/journal/NotesArea.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, MenuItem } from "@mui/material";

import { NoteCard } from "./NoteCard";

import { VoidNoteDialog } from "../../features/journal/dialogs/VoidNoteDialog";
import { DeleteNoteDialog } from "../../features/journal/dialogs/DeleteNoteDialog";

import type { JournalNote } from "../../features/journal/types";

type Props = {
  notes: JournalNote[];
  selectedNoteId: string | null;

  onNewNote: () => void;
  onSelectNote: (id: string) => void;
  onOpenNote: (id: string) => void;

  onVoidNote: (id: string, reason: string) => void;
  onDeleteNote: (id: string) => void;
  onSignNote: (id: string) => void;
};

export function NotesArea({
  notes,
  selectedNoteId,
  onNewNote,
  onSelectNote,
  onOpenNote,
  onVoidNote,
  onDeleteNote,
  onSignNote,
}: Props) {
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuNoteId, setMenuNoteId] = useState<string | null>(null);

  const [isVoidOpen, setIsVoidOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* ---------------- Derived ---------------- */
  const selectedNote = useMemo(
    () =>
      selectedNoteId
        ? notes.find((note) => note.id === selectedNoteId) ?? null
        : null,
    [notes, selectedNoteId]
  );

  const menuNote = useMemo(
    () =>
      menuNoteId
        ? notes.find((note) => note.id === menuNoteId) ?? null
        : null,
    [notes, menuNoteId]
  );

  /* ---------------- Auto Scroll ---------------- */
  useEffect(() => {
    if (!selectedNoteId) return;

    itemRefs.current[selectedNoteId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedNoteId]);

  /* ---------------- Helpers ---------------- */
  function openMenu(id: string, anchor: HTMLElement) {
    setMenuNoteId(id);
    setMenuAnchor(anchor);
  }

  function closeMenu() {
    setMenuAnchor(null);
  }

  function resetDialogs() {
    setIsVoidOpen(false);
    setIsDeleteOpen(false);
    setMenuNoteId(null);
  }

  const canSign = (note: JournalNote) => note.status === "Draft";
  const canVoid = (note: JournalNote) => note.status !== "Voided";
  const canDelete = (note: JournalNote) => note.status !== "Signed";

  return (
    <div className="min-h-0 flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Notes area</h2>

        <button
          onClick={onNewNote}
          className="rounded px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          New note
        </button>
      </div>

      {/* Status */}
      <div className="px-3 pb-2 text-sm text-gray-600">
        {selectedNote ? (
          <>
            Showing:{" "}
            <span className="font-medium text-gray-800">
              {selectedNote.title}
            </span>
          </>
        ) : (
          "No note selected."
        )}
      </div>

      {/* Notes List */}
      <div className="px-3 pb-3 overflow-auto min-h-0 space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            ref={(node) => {
              itemRefs.current[note.id] = node;
            }}
          >
            <NoteCard
              note={note}
              isSelected={note.id === selectedNoteId}
              onSelect={onSelectNote}
              onOpen={onOpenNote}
              onOpenMenu={openMenu}
            />
          </div>
        ))}
      </div>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem
          disabled={!menuNote || !canSign(menuNote)}
          onClick={() => {
            if (menuNoteId) onSignNote(menuNoteId);
            closeMenu();
            setMenuNoteId(null);
          }}
        >
          Sign (Signera)
        </MenuItem>

        <MenuItem
          disabled={!menuNote || !canVoid(menuNote)}
          onClick={() => {
            closeMenu();
            setIsVoidOpen(true);
          }}
        >
          Cancel (Makulera)
        </MenuItem>

        <MenuItem
          disabled={!menuNote || !canDelete(menuNote)}
          onClick={() => {
            closeMenu();
            setIsDeleteOpen(true);
          }}
        >
          Delete (Radera)
        </MenuItem>
      </Menu>

      {/* Void Dialog */}
      <VoidNoteDialog
        open={isVoidOpen}
        noteTitle={menuNote?.title}
        onClose={resetDialogs}
        onConfirm={(reason) => {
          if (menuNoteId) {
            onVoidNote(menuNoteId, reason);
          }

          resetDialogs();
        }}
      />

      {/* Delete Dialog */}
      <DeleteNoteDialog
        open={isDeleteOpen}
        noteTitle={menuNote?.title}
        onClose={resetDialogs}
        onConfirm={() => {
          if (menuNoteId) {
            onDeleteNote(menuNoteId);
          }

          resetDialogs();
        }}
      />
    </div>
  );
}