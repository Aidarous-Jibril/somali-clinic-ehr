// src/pages/JournalPage.tsx
import { useState } from "react";

import { useJournalState } from "../features/journal/hooks/useJournalState";

import { NewNoteDialog } from "../features/journal/dialogs/NewNoteDialog";
import { CloseTableDialog } from "../features/journal/dialogs/CloseTableDialog";
import { ReopenTableDialog } from "../features/journal/dialogs/ReopenTableDialog";

import { ViewTree } from "../components/journal/ViewTree";
import { NotesArea } from "../components/journal/NotesArea";
import { OverviewPanel } from "../components/journal/OverviewPanel";
import { JournalTableBar } from "../components/journal/JournalTableBar";

const JournalPage = () => {
  const journal = useJournalState();

  const [closeTableOpen, setCloseTableOpen] = useState(false);
  const [reopenOpen, setReopenOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Toast feedback */}
      {journal.toast && (
        <div className="px-4 py-2 text-sm bg-green-50 border-b border-green-200 text-green-800">
          {journal.toast}
        </div>
      )}

      {/* Page header */}
      <div className="px-4 py-3 border-b bg-white">
        <h1 className="text-lg font-semibold">Journal</h1>
        <p className="text-sm text-gray-600">
          The journal consists of a view tree, notes area, and overview panel.
        </p>
      </div>

      {/* Journal table lifecycle bar */}
      <JournalTableBar
        tables={journal.tables}
        selectedTableId={journal.selectedTableId}
        onSelectTable={journal.setSelectedTableId}
        onCloseTable={() => setCloseTableOpen(true)}
        onReopenTable={() => setReopenOpen(true)}
      />

      {/* Main layout */}
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
            onDeleteNote={journal.deleteNote}
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

      {/* Dialogs */}
      <NewNoteDialog
        open={journal.isEditorOpen}
        note={journal.editingNote}
        mode={journal.editorMode}
        onClose={journal.closeEditor}
        onChange={journal.updateEditingNote}
        onSave={journal.saveEditingNote}
        onSign={journal.signEditingNote}
      />

      <CloseTableDialog
        open={closeTableOpen}
        onClose={() => setCloseTableOpen(false)}
        onConfirm={(reason, comment) => {
          journal.closeSelectedTable(reason, comment);
          setCloseTableOpen(false);
        }}
      />

      <ReopenTableDialog
        open={reopenOpen}
        onClose={() => setReopenOpen(false)}
        onConfirm={() => {
          journal.reopenSelectedTable();
          setReopenOpen(false);
        }}
      />
    </div>
  );
};

export default JournalPage;
