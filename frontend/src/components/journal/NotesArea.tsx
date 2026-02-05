// src/components/journal/NotesArea.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { NoteCard } from "./NoteCard";
import type { JournalNote } from "../../features/journal/types";

// NEW:
import { Menu, MenuItem } from "@mui/material";
import { VoidNoteDialog } from "../../features/journal/dialogs/VoidNoteDialog";
import { DeleteNoteDialog } from "../../features/journal/dialogs/DeleteNoteDialog";

type Props = {
  notes: JournalNote[];
  selectedNoteId: string | null;
  onNewNote: () => void;

  onSelectNote: (id: string) => void;
  onOpenNote: (id: string) => void;

  // NEW actions from hook:
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
  onSignNote
}: Props) {
  const mapRef = useRef<Record<string, HTMLDivElement | null>>({});

  const selected = useMemo(
    () => (selectedNoteId ? notes.find((n) => n.id === selectedNoteId) : null),
    [notes, selectedNoteId]
  );

  useEffect(() => {
    if (!selectedNoteId) return;
    const el = mapRef.current[selectedNoteId];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedNoteId]);

  // NEW: context menu state
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuNoteId, setMenuNoteId] = useState<string | null>(null);

  // NEW: dialogs
  const [voidOpen, setVoidOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const menuNote = useMemo(
    () => (menuNoteId ? notes.find((n) => n.id === menuNoteId) ?? null : null),
    [notes, menuNoteId]
  );

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuNoteId(null);
  };

  const canVoid = (n: JournalNote) => n.status !== "Voided";
  const canDelete = (n: JournalNote) => n.status !== "Signed"; // safe rule
  const canSign = (n: JournalNote) => n.status === "Draft";

  return (
    <div className="min-h-0 flex flex-col">
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="text-sm font-semibold">Notes area</div>

        <button
          onClick={onNewNote}
          className="rounded px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          New note
        </button>
      </div>

      <div className="px-3 pb-2 text-sm text-gray-600">
        {selected ? (
          <span>
            Showing: <span className="font-medium text-gray-800">{selected.title}</span>
          </span>
        ) : (
          "No note selected."
        )}
      </div>

      <div className="px-3 pb-3 overflow-auto min-h-0 space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            ref={(node) => {
              mapRef.current[note.id] = node;
            }}
          >
            <NoteCard
              note={note}
              isSelected={note.id === selectedNoteId}
              onSelect={onSelectNote}
              onOpen={onOpenNote}
              onOpenMenu={(id, anchor) => {
                setMenuNoteId(id);
                setMenuAnchor(anchor);
              }}
            />
          </div>
        ))}

      </div>
      {/* Right-click menu */}
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
          }}
        >
          Sign (Signera)
        </MenuItem>
        <MenuItem
          disabled={!menuNote || !canVoid(menuNote)}
          onClick={() => {
            closeMenu();
            setVoidOpen(true);
          }}
        >
          Cancel (Makulera)
        </MenuItem>

        <MenuItem
          disabled={!menuNote || !canDelete(menuNote)}
          onClick={() => {
            closeMenu();
            setDeleteOpen(true);
          }}
        >
          Delete (Radera)
        </MenuItem>
      </Menu>

      {/* Void dialog */}
      <VoidNoteDialog
        open={voidOpen}
        noteTitle={menuNote?.title}
        onClose={() => setVoidOpen(false)}
        onConfirm={(reason) => {
          if (menuNoteId) onVoidNote(menuNoteId, reason);
          setVoidOpen(false);
        }}
      />

      {/* Delete dialog */}
      <DeleteNoteDialog
        open={deleteOpen}
        noteTitle={menuNote?.title}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          if (menuNoteId) onDeleteNote(menuNoteId);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
