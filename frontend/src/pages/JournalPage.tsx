// src/pages/JournalPage.tsx

import { useState } from "react";

import { useJournalState } from "../features/journal/hooks/useJournalState";

import { ViewTree } from "../components/journal/ViewTree";
import { NotesArea } from "../components/journal/NotesArea";
import { OverviewPanel } from "../components/journal/OverviewPanel";
import { JournalTableBar } from "../components/journal/JournalTableBar";

import { NewNoteDialog } from "../features/journal/dialogs/NewNoteDialog";
import { CloseTableDialog } from "../features/journal/dialogs/CloseTableDialog";
import { ReopenTableDialog } from "../features/journal/dialogs/ReopenTableDialog";
import { DeleteNoteDialog } from "../features/journal/dialogs/DeleteNoteDialog";

export default function JournalPage() {
  const journal = useJournalState();

  const [isCloseTableOpen, setIsCloseTableOpen] = useState(false);
  const [isReopenTableOpen, setIsReopenTableOpen] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const noteToDelete = journal.filteredNotes.find(
    (note) => note.id === deleteNoteId
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 border-b bg-white">
        <h1 className="text-lg font-semibold">Journal</h1>
        <p className="text-sm text-gray-600">
          The journal consists of a view tree, notes area, and overview panel.
        </p>
      </header>

      {/* Table Bar */}
      <JournalTableBar
        tables={journal.tables}
        selectedTableId={journal.selectedTableId}
        onSelectTable={journal.setSelectedTableId}
        onCloseTable={() => setIsCloseTableOpen(true)}
        onReopenTable={() => setIsReopenTableOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 min-h-0">
        <aside className="col-span-3 border-r bg-white min-h-0">
          <ViewTree
            items={journal.viewTree}
            selected={journal.selectedView}
            onSelect={journal.setSelectedView}
          />
        </aside>

        <main className="col-span-6 bg-gray-50 min-h-0">
          <NotesArea
            notes={journal.filteredNotes}
            selectedNoteId={journal.selectedNoteId}
            onNewNote={journal.openNewNote}
            onSelectNote={journal.setSelectedNoteId}
            onOpenNote={journal.openNoteFromCard}
            onVoidNote={journal.voidNote}
            onDeleteNote={setDeleteNoteId}
            onSignNote={journal.signNote}
          />
        </main>

        <aside className="col-span-3 border-l bg-white min-h-0">
          <OverviewPanel
            searchQuery={journal.searchQuery}
            onSearchChange={journal.setSearchQuery}
            notes={journal.filteredNotes}
            selectedNoteId={journal.selectedNoteId}
            onSelectNote={journal.setSelectedNoteId}
          />
        </aside>
      </div>

      {/* Note Editor */}
      <NewNoteDialog
        open={journal.isEditorOpen}
        note={journal.editingNote}
        mode={journal.editorMode}
        tableStatus={journal.selectedTable?.status}
        encounters={journal.encounters}
        staff={journal.staff}
        units={journal.units}
        onClose={journal.closeEditor}
        onChange={journal.updateEditingNote}
        onSave={journal.saveEditingNote}
        onSign={journal.signEditingNote}
      />

      {/* Close Journal Table */}
      <CloseTableDialog
        open={isCloseTableOpen}
        onClose={() => setIsCloseTableOpen(false)}
        onConfirm={async (reason, comment) => {
          await journal.closeSelectedTable(reason, comment);
          setIsCloseTableOpen(false);
        }}
      />

      {/* Reopen Journal Table */}
      <ReopenTableDialog
        open={isReopenTableOpen}
        onClose={() => setIsReopenTableOpen(false)}
        onConfirm={async () => {
          await journal.reopenSelectedTable();
          setIsReopenTableOpen(false);
        }}
      />

      {/* Delete Note */}
      <DeleteNoteDialog
        open={Boolean(deleteNoteId)}
        noteTitle={noteToDelete?.title}
        onClose={() => setDeleteNoteId(null)}
        onConfirm={async () => {
          if (!deleteNoteId) return;

          await journal.deleteNote(deleteNoteId);
          setDeleteNoteId(null);
        }}
      />
    </div>
  );
}