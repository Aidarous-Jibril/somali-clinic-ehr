// src/features/messenger/utils.ts

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

export const makeMessageId = () => `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const nowDateTime = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};
