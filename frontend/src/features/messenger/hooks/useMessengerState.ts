// src/features/messenger/hooks/useMessengerState.tsx
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import type {
  MessengerComposeDraft,
  MessengerComposeMode,
  MessengerFolder,
  MessengerMessage,
  MessengerPatientScope,
  MessengerTypeFilter,
} from "../types";

import { initialMessengerMessages } from "../mockData";
import { DEFAULT_NEW_DRAFT, NO_RECIPIENT, NO_SUBJECT } from "../constants";
import { makeMessageId, nowDateTime } from "../utils";

// ------------------------------------------------------
// Hook
// ------------------------------------------------------

export const useMessengerState = () => {
  // ----------------------------------------------------
  // State: data
  // ----------------------------------------------------
  const [messages, setMessages] = useState<MessengerMessage[]>(initialMessengerMessages);

  // ----------------------------------------------------
  // State: navigation + selection
  // ----------------------------------------------------
  const [folder, setFolder] = useState<MessengerFolder>("inbox");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ----------------------------------------------------
  // State: filters (UI)
  // ----------------------------------------------------
  const [typeFilter, setTypeFilter] = useState<MessengerTypeFilter>("all");
  const [patientScope, setPatientScope] = useState<MessengerPatientScope>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("(All)");
  const [groupByCategory, setGroupByCategory] = useState(false);

  // ----------------------------------------------------
  // State: dialogs (read + compose)
  // ----------------------------------------------------
  const [openRead, setOpenRead] = useState(false);
  const [openCompose, setOpenCompose] = useState(false);
  const [composeDraft, setComposeDraft] = useState<MessengerComposeDraft | null>(null);

  // ----------------------------------------------------
  // Derived data
  // ----------------------------------------------------

  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? null,
    [messages, selectedId]
  );

  const unreadInboxCount = useMemo(
    () => messages.filter((m) => m.folder === "inbox" && !m.read).length,
    [messages]
  );

  const categoriesForFolder = useMemo(() => {
    const cats = new Set<string>();
    messages
      .filter((m) => m.folder === folder)
      .forEach((m) => cats.add(m.category));
    return ["(All)", ...Array.from(cats).sort()];
  }, [messages, folder]);

  const filtered = useMemo(() => {
    let list = messages.filter((m) => m.folder === folder);

    // Type filter
    if (typeFilter !== "all") {
      list = list.filter((m) => m.type === typeFilter);
    }

    // Patient scope (only if a selected patient exists)
    if (patientScope === "only_selected_patient") {
      const pid = selectedMessage?.patientId;
      list = pid ? list.filter((m) => m.patientId === pid) : [];
    }

    // Category filter
    if (categoryFilter !== "(All)") {
      list = list.filter((m) => m.category === categoryFilter);
    }

    // Sort newest first
    return [...list].sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : -1));
  }, [messages, folder, typeFilter, patientScope, categoryFilter, selectedMessage?.patientId]);

  // ----------------------------------------------------
  // Actions: open / read
  // ----------------------------------------------------

  const openSelected = () => {
    if (!selectedMessage) return;

    setOpenRead(true);

    // mark read on open (only inbox)
    if (!selectedMessage.read && selectedMessage.folder === "inbox") {
      setMessages((prev) => prev.map((m) => (m.id === selectedMessage.id ? { ...m, read: true } : m)));
    }
  };

  // ----------------------------------------------------
  // Actions: delete
  // ----------------------------------------------------

  const deleteSelected = () => {
    if (!selectedMessage) return;

    // If already in trash => permanent delete
    if (selectedMessage.folder === "trash") {
      setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
      toast.info("Deleted permanently");
    } else {
      setMessages((prev) => prev.map((m) => (m.id === selectedMessage.id ? { ...m, folder: "trash" } : m)));
      toast.info("Moved to trash");
    }

    setSelectedId(null);
    setOpenRead(false);
  };

  // ----------------------------------------------------
  // Actions: compose
  // ----------------------------------------------------

  const startCompose = (mode: MessengerComposeMode) => {
    const base = selectedMessage;

    const draft: MessengerComposeDraft =
      mode === "new"
        ? { ...DEFAULT_NEW_DRAFT }
        : {
            mode,
            replyToId: base?.id,
            type: base?.type ?? "patient_related",
            category: base?.category ?? DEFAULT_NEW_DRAFT.category,
            to: mode === "forward" ? "" : base?.from ?? "",
            subject: mode === "forward" ? `Fwd: ${base?.subject ?? ""}` : `Re: ${base?.subject ?? ""}`,
            body:
              mode === "forward"
                ? `\n\n--- Forwarded message ---\nFrom: ${base?.from}\nTo: ${base?.to}\nDate: ${base?.receivedAt}\nSubject: ${base?.subject}\n\n${base?.body ?? ""}`
                : `\n\n--- Original message ---\n${base?.body ?? ""}`,
            patientId: base?.patientId,
            patientName: base?.patientName,
            scheduleLater: false,
            scheduledFor: "",
          };

    setComposeDraft(draft);
    setOpenCompose(true);
  };

  const saveDraft = () => {
    if (!composeDraft) return;

    const draft: MessengerMessage = {
      id: makeMessageId(),
      folder: "drafts",
      type: composeDraft.type,
      category: composeDraft.category,
      subject: composeDraft.subject || NO_SUBJECT,
      body: composeDraft.body || "",
      patientId: composeDraft.patientId,
      patientName: composeDraft.patientName,
      from: "You",
      to: composeDraft.to || NO_RECIPIENT,
      receivedAt: nowDateTime(),
      read: true,
    };

    setMessages((prev) => [draft, ...prev]);
    toast.success("Saved to drafts");
    setOpenCompose(false);
    setComposeDraft(null);
  };

  const send = () => {
    if (!composeDraft) return;

    const isScheduled = Boolean(composeDraft.scheduleLater && composeDraft.scheduledFor?.trim());

    const sentMsg: MessengerMessage = {
      id: makeMessageId(),
      folder: isScheduled ? "outgoing" : "sent",
      type: composeDraft.type,
      category: composeDraft.category,
      subject: composeDraft.subject || NO_SUBJECT,
      body: composeDraft.body || "",
      patientId: composeDraft.patientId,
      patientName: composeDraft.patientName,
      from: "You",
      to: composeDraft.to || NO_RECIPIENT,
      receivedAt: nowDateTime(),
      scheduledFor: isScheduled ? composeDraft.scheduledFor?.trim() : undefined,
      read: true,
    };

    setMessages((prev) => [sentMsg, ...prev]);
    toast.success(isScheduled ? "Message scheduled" : "Message sent");
    setOpenCompose(false);
    setComposeDraft(null);
  };

  // ----------------------------------------------------
  // Actions: read-state helpers
  // ----------------------------------------------------

  const markSelectedRead = (read: boolean) => {
    if (!selectedMessage) return;
    setMessages((prev) => prev.map((m) => (m.id === selectedMessage.id ? { ...m, read } : m)));
  };

  const setSelectedPatientScope = (scope: MessengerPatientScope) => setPatientScope(scope);

  // ----------------------------------------------------
  // Return API (hook contract)
  // ----------------------------------------------------

  return {
    // data
    messages,
    folder,
    filtered,
    selectedId,
    selectedMessage,
    unreadInboxCount,

    // filters
    typeFilter,
    patientScope,
    categoryFilter,
    categoriesForFolder,
    groupByCategory,

    // ui state
    openRead,
    openCompose,
    composeDraft,

    // setters
    setFolder,
    setSelectedId,
    setTypeFilter,
    setSelectedPatientScope,
    setCategoryFilter,
    setGroupByCategory,

    setOpenRead,
    setOpenCompose,
    setComposeDraft,

    // actions
    openSelected,
    deleteSelected,
    startCompose,
    saveDraft,
    send,
    markSelectedRead,
  };
};

export type MessengerState = ReturnType<typeof useMessengerState>;
