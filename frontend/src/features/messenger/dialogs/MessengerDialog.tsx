// src/features/messenger/dialogs/MessengerDialog.tsx
import React, { useMemo } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Radio,
  TextField,
  Tooltip,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import OutboxIcon from "@mui/icons-material/Outbox";
import SendIcon from "@mui/icons-material/Send";
import DraftsIcon from "@mui/icons-material/Drafts";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

import type { MessengerFolder, MessengerMessage } from "../types";
import type { MessengerState } from "../hooks/useMessengerState";
import { ReadMessageDialog } from "./ReadMessageDialog";
import { ComposeMessageDialog } from "./ComposeMessageDialog";

type Props = {
  open: boolean;
  onClose: () => void;
  state: MessengerState;

  /** Optional explicit container. If not provided we will use #app-content. */
  container?: HTMLElement | null;
};

const folderLabel: Record<MessengerFolder, string> = {
  inbox: "Inbox",
  outgoing: "Outgoing",
  sent: "Sent",
  drafts: "Drafts",
  trash: "Trash",
};

export const MessengerDialog: React.FC<Props> = ({ open, onClose, state, container }) => {
  const {
    folder,
    setFolder,
    filtered,
    selectedId,
    setSelectedId,
    selectedMessage,
    openSelected,
    deleteSelected,

    typeFilter,
    setTypeFilter,
    patientScope,
    setSelectedPatientScope,
    categoryFilter,
    setCategoryFilter,
    categoriesForFolder,
    groupByCategory,
    setGroupByCategory,

    openRead,
    setOpenRead,
    openCompose,
    setOpenCompose,
    composeDraft,
    setComposeDraft,

    startCompose,
    saveDraft,
    send,
    markSelectedRead,
  } = state;

  const canActOnSelected = Boolean(selectedMessage);

  const groupedRows = useMemo(() => {
    if (!groupByCategory) return [{ key: "__all__", title: "", rows: filtered }];

    const map = new Map<string, typeof filtered>();
    for (const m of filtered) {
      const key = m.category || "(No category)";
      map.set(key, [...(map.get(key) ?? []), m]);
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, rows]) => ({ key, title: key, rows }));
  }, [filtered, groupByCategory]);

  const Row = (m: MessengerMessage) => {
    const isSelected = m.id === selectedId;
    const bg = m.type === "patient_related" ? "bg-green-50" : "bg-white";
    const selectedBg = isSelected ? "ring-2 ring-blue-600" : "";

    return (
      <tr
        key={m.id}
        className={`${bg} hover:bg-blue-50 cursor-pointer ${selectedBg}`}
        onClick={() => setSelectedId(m.id)}
        onDoubleClick={() => openSelected()}
      >
        <td className="px-2 py-1 w-[26px]">
          <span
            className="inline-block h-2 w-2 rounded-full bg-yellow-500"
            style={{ opacity: m.read ? 0 : 1 }}
          />
        </td>
        <td className="px-2 py-1 text-[12px] font-semibold">{m.subject}</td>
        <td className="px-2 py-1 text-[12px]">{m.patientId ?? "-"}</td>
        <td className="px-2 py-1 text-[12px]">{m.category}</td>
        <td className="px-2 py-1 text-[12px]">{m.from}</td>
        <td className="px-2 py-1 text-[12px]">{m.receivedAt}</td>
        <td className="px-2 py-1 text-[12px]">{m.patientName ?? "-"}</td>
      </tr>
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xl"
        disablePortal
        // ✅ Critical: make Modal/backdrop ABSOLUTE (not fixed), so it only covers the container
        slotProps={{
          root: {
            sx: {
              position: "absolute",
              inset: 0,
            },
          },
          backdrop: {
            sx: {
              position: "absolute",
              inset: 0,
            },
          },
        }}
      >
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Messenger</span>
            <span className="text-sm text-gray-600">— {folderLabel[folder]}</span>
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogTitle>

        <DialogContent>
          <div className="grid gap-3 md:grid-cols-[64px_1fr]">
            {/* Left icon bar (Cosmic-like) */}
            <div className="flex flex-col gap-2 pt-2">
              <Tooltip title="Inbox">
                <button
                  type="button"
                  onClick={() => setFolder("inbox")}
                  className={`rounded p-2 ${
                    folder === "inbox" ? "bg-blue-700 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <InboxIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Outgoing">
                <button
                  type="button"
                  onClick={() => setFolder("outgoing")}
                  className={`rounded p-2 ${
                    folder === "outgoing" ? "bg-blue-700 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <OutboxIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Sent">
                <button
                  type="button"
                  onClick={() => setFolder("sent")}
                  className={`rounded p-2 ${
                    folder === "sent" ? "bg-blue-700 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <SendIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Drafts">
                <button
                  type="button"
                  onClick={() => setFolder("drafts")}
                  className={`rounded p-2 ${
                    folder === "drafts" ? "bg-blue-700 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <DraftsIcon fontSize="small" />
                </button>
              </Tooltip>

              <Tooltip title="Trash">
                <button
                  type="button"
                  onClick={() => setFolder("trash")}
                  className={`rounded p-2 ${
                    folder === "trash" ? "bg-blue-700 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </Tooltip>

              <div className="h-2" />

              <Tooltip title="Settings (later)">
                <button type="button" className="rounded p-2 hover:bg-gray-100 text-gray-700">
                  <SettingsIcon fontSize="small" />
                </button>
              </Tooltip>
            </div>

            {/* Main area */}
            <div className="space-y-2">
              {/* Filters bar */}
              <div className="rounded border border-gray-200 p-2">
                <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_auto_auto] items-center">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold text-gray-700">Type:</span>

                    <label className="flex items-center gap-1">
                      <Radio size="small" checked={typeFilter === "all"} onChange={() => setTypeFilter("all")} />
                      All
                    </label>

                    <label className="flex items-center gap-1">
                      <Radio
                        size="small"
                        checked={typeFilter === "non_patient_related"}
                        onChange={() => setTypeFilter("non_patient_related")}
                      />
                      Non-patient
                    </label>

                    <label className="flex items-center gap-1">
                      <Radio
                        size="small"
                        checked={typeFilter === "patient_related"}
                        onChange={() => setTypeFilter("patient_related")}
                      />
                      Patient
                    </label>

                    <label className="flex items-center gap-1">
                      <Radio
                        size="small"
                        checked={patientScope === "only_selected_patient"}
                        onChange={() => setSelectedPatientScope("only_selected_patient")}
                        disabled={!selectedMessage?.patientId}
                      />
                      Only selected patient
                    </label>
                  </div>

                  <TextField
                    label="Category"
                    size="small"
                    select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    fullWidth
                  >
                    {categoriesForFolder.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>

                  <FormControlLabel
                    control={<Checkbox checked={groupByCategory} onChange={(e) => setGroupByCategory(e.target.checked)} />}
                    label="Group by category"
                  />

                  <Button variant="outlined" onClick={() => markSelectedRead(true)} disabled={!canActOnSelected}>
                    Mark read
                  </Button>
                </div>
              </div>

              {/* Actions bar */}
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outlined" onClick={() => startCompose("new")}>
                  New
                </Button>

                <Button variant="outlined" onClick={() => startCompose("reply")} disabled={!canActOnSelected}>
                  Reply
                </Button>

                <Button variant="outlined" onClick={() => startCompose("reply_all")} disabled={!canActOnSelected}>
                  Reply all
                </Button>

                <Button variant="outlined" onClick={() => startCompose("forward")} disabled={!canActOnSelected}>
                  Forward
                </Button>

                <Button variant="outlined" onClick={deleteSelected} disabled={!canActOnSelected}>
                  Delete
                </Button>

                <div className="ml-auto text-sm text-gray-600">
                  Showing <span className="font-semibold">{filtered.length}</span> messages
                </div>
              </div>

              {/* Table */}
              <div className="rounded border border-gray-200 overflow-hidden">
                <div className="max-h-[55vh] overflow-auto">
                  <table className="w-full border-collapse text-left">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr className="text-[12px] text-gray-700">
                        <th className="px-2 py-2 w-[26px]"></th>
                        <th className="px-2 py-2">Subject</th>
                        <th className="px-2 py-2">National ID</th>
                        <th className="px-2 py-2">Category</th>
                        <th className="px-2 py-2">From</th>
                        <th className="px-2 py-2">Received</th>
                        <th className="px-2 py-2">Name</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td className="px-3 py-6 text-sm text-gray-500" colSpan={7}>
                            No messages in this folder / filter.
                          </td>
                        </tr>
                      ) : (
                        groupedRows.map((g) => (
                          <React.Fragment key={g.key}>
                            {groupByCategory && (
                              <tr>
                                <td colSpan={7} className="bg-gray-100 px-3 py-1 text-[12px] font-semibold text-gray-700">
                                  {g.title}
                                </td>
                              </tr>
                            )}
                            {g.rows.map((m) => Row(m))}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-[12px] text-gray-500">Tip: single click selects, double click opens.</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReadMessageDialog
        open={openRead}
        message={selectedMessage}
        onClose={() => setOpenRead(false)}
        onReply={() => startCompose("reply")}
        onReplyAll={() => startCompose("reply_all")}
        onForward={() => startCompose("forward")}
        onDelete={deleteSelected}
      />

      <ComposeMessageDialog
        open={openCompose}
        draft={composeDraft}
        setDraft={setComposeDraft}
        onClose={() => {
          setOpenCompose(false);
          setComposeDraft(null);
        }}
        onSaveDraft={saveDraft}
        onSend={send}
      />
    </>
  );
};
