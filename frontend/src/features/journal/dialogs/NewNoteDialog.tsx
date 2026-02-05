// src/features/journal/dialogs/NewNoteDialog.tsx
import { JOURNAL_TEMPLATES } from "../templates/templates";
import { ENCOUNTER_OPTIONS, STAFF_OPTIONS, UNIT_OPTIONS } from "../mockData";
import type { JournalNote } from "../types";

type Props = {
  open: boolean;
  note: JournalNote | null;
  mode: "edit" | "read";

  onClose: () => void;
  onChange: (patch: Partial<JournalNote>) => void;

  onSave: (opts?: { closeAfter?: boolean }) => void;
  onSign: () => void;
};

export function NewNoteDialog({ open, note, mode, onClose, onChange, onSave, onSign }: Props) {
  if (!open || !note) return null;

  const isReadOnly = mode === "read";

  const selectedTemplate = note.templateId
    ? JOURNAL_TEMPLATES.find((t) => t.id === note.templateId)
    : null;

  const sections = selectedTemplate?.sections ?? [];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute inset-4 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        <div className="h-12 px-4 flex items-center justify-between border-b bg-white">
          <div className="font-semibold text-sm">
            {isReadOnly ? "Note (read-only)" : "New note"} •{" "}
            <span className="text-gray-600">{note.status}</span>
          </div>

          <button onClick={onClose} className="text-sm px-3 py-1 rounded hover:bg-gray-100">
            Close
          </button>
        </div>

        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Template</label>
              <select
                disabled={isReadOnly}
                value={note.templateId ?? ""}
                onChange={(e) => onChange({ templateId: e.target.value || undefined })}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-100"
              >
                <option value="">Select template…</option>
                {JOURNAL_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Encounter</label>
              <select
                disabled={isReadOnly}
                value={note.encounterLabel ?? ""}
                onChange={(e) => onChange({ encounterLabel: e.target.value })}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-100"
              >
                <option value="">Select encounter…</option>
                {ENCOUNTER_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Staff</label>
              <select
                disabled={isReadOnly}
                value={note.staffLabel ?? ""}
                onChange={(e) =>
                  onChange({
                    staffLabel: e.target.value,
                    author: e.target.value || note.author,
                  })
                }
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-100"
              >
                <option value="">Select staff…</option>
                {STAFF_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Unit</label>
              <select
                disabled={isReadOnly}
                value={note.unit ?? ""}
                onChange={(e) => onChange({ unit: e.target.value })}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-100"
              >
                {UNIT_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-xs text-gray-600 mb-1">Event</label>
              <input
                disabled={isReadOnly}
                type="datetime-local"
                value={toLocalInputValue(note.eventDateTime ?? note.dateTime)}
                onChange={(e) => onChange({ eventDateTime: fromLocalInputValue(e.target.value) })}
                className="w-full rounded border border-gray-300 bg-white px-2 py-2 text-sm disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 min-h-0">
          <aside className="col-span-3 border-r bg-white min-h-0">
            <div className="px-3 py-2 text-sm font-semibold">Sections</div>

            {selectedTemplate ? (
              <div className="px-2 pb-2 overflow-auto min-h-0">
                {sections.map((s) => (
                  <a
                    key={s.key}
                    href={`#sec-${s.key}`}
                    className="block rounded px-2 py-2 text-sm hover:bg-gray-100 text-gray-800"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ) : (
              <div className="px-3 py-3 text-sm text-gray-600">
                No template selected. Choose a template to continue.
              </div>
            )}
          </aside>

          <main className="col-span-9 bg-gray-50 min-h-0 overflow-auto">
            <div className="p-4">
              {!selectedTemplate ? (
                <div className="rounded border border-gray-200 bg-white p-6 text-sm text-gray-700">
                  <div className="font-semibold mb-1">No template selected</div>
                  Select a template to start writing this note.
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((s) => (
                    <div key={s.key} id={`sec-${s.key}`} className="rounded border bg-white p-4">
                      <div className="text-sm font-semibold mb-2">{s.label}</div>
                      <textarea
                        disabled={isReadOnly}
                        value={note.sectionValues?.[s.key] ?? ""}
                        onChange={(e) =>
                          onChange({
                            sectionValues: {
                              ...(note.sectionValues ?? {}),
                              [s.key]: e.target.value,
                            },
                          })
                        }
                        placeholder={s.placeholder}
                        className="w-full min-h-[110px] rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* footer */}
        <div className="h-14 px-4 flex items-center justify-end gap-2 border-t bg-white">
          {isReadOnly ? (
            <button
              onClick={onClose}
              className="rounded px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={() => onSave?.()}
                className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
              >
                Save
              </button>
              <button
                onClick={() => onSave?.({ closeAfter: true })}
                className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
              >
                Save &amp; close
              </button>
              <button
                onClick={onSign}
                className="rounded px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function fromLocalInputValue(v: string) {
  const d = new Date(v);
  return d.toISOString();
}
