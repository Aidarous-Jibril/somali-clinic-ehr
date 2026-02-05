// src/features/messenger/types.ts

// ------------------------------------------------------
// Shared / core types
// ------------------------------------------------------

export type DateTimeString = string; // "YYYY-MM-DD HH:mm"

export type MessengerFolder = "inbox" | "outgoing" | "sent" | "drafts" | "trash";

export type MessengerMessageType = "patient_related" | "non_patient_related";

// ------------------------------------------------------
// Message model (Cosmic-like table row)
// ------------------------------------------------------

export type MessengerMessage = {
  id: string;
  folder: MessengerFolder;

  type: MessengerMessageType;
  category: string;

  subject: string;
  body: string;

  // Patient link (optional)
  patientId?: string; // e.g. "19 930932-0019"
  patientName?: string;

  // columns you see in Cosmic-like table
  from: string; // "Ssk Törn, Måns"
  to: string; // "Leg läk Högdal, Olof"
  receivedAt: DateTimeString; // "2020-05-29 11:18"

  // Outgoing scheduling (optional)
  scheduledFor?: DateTimeString;

  read: boolean;
};

// ------------------------------------------------------
// Compose / draft
// ------------------------------------------------------

export type MessengerComposeMode = "new" | "reply" | "reply_all" | "forward";

export type MessengerComposeDraft = {
  mode: MessengerComposeMode;
  replyToId?: string;

  type: MessengerMessageType;
  category: string;

  to: string;
  subject: string;
  body: string;

  patientId?: string;
  patientName?: string;

  scheduleLater?: boolean;
  scheduledFor?: DateTimeString;
};

// ------------------------------------------------------
// UI filter types (used by useMessengerState)
// ------------------------------------------------------

export type MessengerTypeFilter = "all" | MessengerMessageType;

export type MessengerPatientScope = "all" | "only_selected_patient";
