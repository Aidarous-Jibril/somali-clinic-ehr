// src/features/messenger/constants.ts

import type { MessengerComposeDraft, MessengerMessageType } from "./types";

// ------------------------------------------------------
// UI defaults
// ------------------------------------------------------

export const DEFAULT_CATEGORY = "General information";
export const NO_SUBJECT = "(No subject)";
export const NO_RECIPIENT = "(No recipient)";

export const DEFAULT_NEW_DRAFT: MessengerComposeDraft = {
  mode: "new",
  type: "non_patient_related" as MessengerMessageType,
  category: DEFAULT_CATEGORY,
  to: "",
  subject: "",
  body: "",
  scheduleLater: false,
  scheduledFor: "",
};
