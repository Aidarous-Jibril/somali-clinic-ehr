// src/features/journal/dialogs/NewNoteDialog.tsx

import { fromLocalInputValue, toLocalInputValue } from "../../../utils/dateFormat";
import { JOURNAL_TEMPLATES } from "../templates/templates";
import type { JournalNote } from "../types";

type Props = {
  open: boolean;
  note: JournalNote | null;
  mode: "edit" | "read";
  tableStatus?: "Open" | "Closed";

  encounters: any[];
  staff: any[];
  units: any[];

  onClose: () => void;
  onChange: (patch: Partial<JournalNote>) => void;
  onSave: (options?: { closeAfter?: boolean }) => void;
  onSign: () => void;
};

export function NewNoteDialog({
  open,
  note,
  mode,
  tableStatus,
  encounters,
  staff,
  units,
  onClose,
  onChange,
  onSave,
  onSign,
}: Props) {
  if (!open || !note) return null;

  const isReadOnly =
    mode === "read" || tableStatus === "Closed";

  const selectedTemplate = note.templateId
    ? JOURNAL_TEMPLATES.find(
        (template) => template.id === note.templateId
      )
    : null;

  const sections = selectedTemplate?.sections ?? [];

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <div className="absolute inset-4 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-12 px-4 border-b flex items-center justify-between">
          <div className="text-sm font-semibold">
            {isReadOnly
              ? "Note (read-only)"
              : "New note"}{" "}
            •{" "}
            <span className="text-gray-500">
              {note.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {/* Top Form */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="grid grid-cols-12 gap-3 items-end">
            {/* Template */}
            <Field label="Template" span="col-span-3">
              <select
                disabled={isReadOnly}
                value={note.templateId ?? ""}
                onChange={(e) =>
                  onChange({
                    templateId:
                      e.target.value || undefined,
                  })
                }
                className={inputClass(isReadOnly)}
              >
                <option value="">
                  Select template...
                </option>

                {JOURNAL_TEMPLATES.map((template) => (
                  <option
                    key={template.id}
                    value={template.id}
                  >
                    {template.label}
                  </option>
                ))}
              </select>
            </Field>

            {/* Encounter */}
            <Field
              label="Encounter *"
              span="col-span-3"
            >
              <select
                disabled={isReadOnly}
                value={note.encounterLabel ?? ""}
                onChange={(e) =>
                  onChange({
                    encounterLabel:
                      e.target.value,
                  })
                }
                className={inputClass(isReadOnly)}
              >
                <option value="">
                  Select encounter...
                </option>

                {encounters.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    Active Encounter
                  </option>
                ))}
              </select>
            </Field>

            {/* Staff */}
            <Field label="Staff *" span="col-span-3">
              <select
                disabled={isReadOnly}
                value={note.author ?? ""}
                onChange={(e) =>
                  onChange({
                    author: e.target.value,
                  })
                }
                className={inputClass(isReadOnly)}
              >
                <option value="">
                  Select staff...
                </option>

                {staff.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Unit */}
            <Field label="Unit *" span="col-span-2">
              <select
                disabled={isReadOnly}
                value={note.unit ?? ""}
                onChange={(e) =>
                  onChange({
                    unit: e.target.value,
                  })
                }
                className={inputClass(isReadOnly)}
              >
                <option value="">
                  Select unit...
                </option>

                {units.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Event */}
            <Field label="Event" span="col-span-1">
              <input
                type="datetime-local"
                disabled={isReadOnly}
                value={toLocalInputValue(
                  note.eventDateTime ??
                    note.dateTime
                )}
                onChange={(e) =>
                  onChange({
                    eventDateTime:
                      fromLocalInputValue(
                        e.target.value
                      ),
                  })
                }
                className={inputClass(isReadOnly)}
              />
            </Field>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-12 min-h-0">
          {/* Sidebar */}
          <aside className="col-span-3 border-r bg-white min-h-0">
            <div className="px-3 py-2 text-sm font-semibold">
              Sections
            </div>

            {selectedTemplate ? (
              <div className="px-2 pb-2 overflow-auto min-h-0">
                {sections.map((section) => (
                  <a
                    key={section.key}
                    href={`#sec-${section.key}`}
                    className="block rounded px-2 py-2 text-sm hover:bg-gray-100"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            ) : (
              <div className="px-3 py-3 text-sm text-gray-500">
                No template selected.
              </div>
            )}
          </aside>

          {/* Content */}
          <main className="col-span-9 bg-gray-50 overflow-auto">
            <div className="p-4">
              {!selectedTemplate ? (
                <EmptyState />
              ) : (
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div
                      key={section.key}
                      id={`sec-${section.key}`}
                      className="rounded border bg-white p-4"
                    >
                      <div className="text-sm font-semibold mb-2">
                        {section.label}
                      </div>

                      <textarea
                        disabled={isReadOnly}
                        value={
                          note.sectionValues?.[
                            section.key
                          ] ?? ""
                        }
                        placeholder={
                          section.placeholder
                        }
                        onChange={(e) =>
                          onChange({
                            sectionValues: {
                              ...(note.sectionValues ??
                                {}),
                              [section.key]:
                                e.target.value,
                            },
                          })
                        }
                        className="w-full min-h-[110px] rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Footer */}
        <div className="h-14 px-4 border-t bg-white flex items-center justify-end gap-2">
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
                onClick={() => onSave()}
                className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
              >
                Save
              </button>

              <button
                onClick={() =>
                  onSave({
                    closeAfter: true,
                  })
                }
                className="rounded px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50"
              >
                Save & close
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

/* ---------------- UI Helpers ---------------- */

function Field({
  label,
  span,
  children,
}: {
  label: string;
  span: string;
  children: React.ReactNode;
}) {
  return (
    <div className={span}>
      <label className="block text-xs text-gray-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded border border-gray-200 bg-white p-6 text-sm text-gray-600">
      <div className="font-semibold mb-1">
        No template selected
      </div>
      Select a template to start writing this note.
    </div>
  );
}

function inputClass(disabled?: boolean) {
  return `
    w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white
    outline-none focus:ring-2 focus:ring-blue-300
    disabled:bg-gray-100
  `;
}
