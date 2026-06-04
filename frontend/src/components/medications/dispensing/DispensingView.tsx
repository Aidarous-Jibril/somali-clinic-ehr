// src/components/medications/dispensing/DispensingView.tsx
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import {
  useAdministerDose,
  usePrepareDose,
  useSelfAdministerDose,
  useSkipDose,
} from "../../../hooks/medications/useMedicationDoseActions";

import type {
  Medication,
  MedicationGroup,
  MedicationScheduleItem,
  AdministrationStatus,
} from "../../../features/medications/types";

import { DosePillIcon } from "./DosePillIcon";
import { AdminActionDialog } from "./AdminActionDialog";

type DialogMode = "administer" | "selfAdmin" | "skip";

type SelectedDose = {
  medId: string;
  item: MedicationScheduleItem;
};

type MedicationWithTodaySchedule = Medication & {
  schedule: MedicationScheduleItem[];
};

const doseKey = (medId: string, item: MedicationScheduleItem) =>
  item.uid ? `${medId}|${item.uid}` : `${medId}|${item.date}|${item.time}|${item.label}`;

const formatStatus = (status: AdministrationStatus) =>
  ({
    planned: "Planned",
    prepared: "Prepared",
    given: "Given",
    selfAdmin: "Self-administered",
    skipped: "Skipped",
    notNeeded: "Not needed",
    missed: "Missed",
  }[status] ?? status);

export function DispensingView({ groups }: { groups: MedicationGroup[]; }) {
  //Filter Only Today’s Doses
  const today = dayjs().format("YYYY-MM-DD");

  /* ------------------------------------------------------------------ */
  /* Data                                                               */
  /* ------------------------------------------------------------------ */
  const medications = useMemo<MedicationWithTodaySchedule[]>(
    () =>
      groups
        .flatMap((g) => g.items ?? [])
        .map((m) => ({
          ...m,
          schedule: (m.schedule ?? []).filter( (d) => d.date === today ),
        }))
        .filter((m) => m.schedule.length > 0),
    [groups, today]
  );

  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */
  const [selectedMedicationId, setSelectedMedicationId] =
    useState<string | null>(null);

  const [selectedDose, setSelectedDose] =
    useState<SelectedDose | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] =
    useState<DialogMode>("administer");

  const [statusOverrides, setStatusOverrides] =
    useState<Record<string, AdministrationStatus>>({});

  const [selfAdminKeys, setSelfAdminKeys] =
    useState<Record<string, boolean>>({});

  /* ------------------------------------------------------------------ */
  /* Auto-select first medication                                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!medications.length) {
      setSelectedMedicationId(null);
      setSelectedDose(null);
      return;
    }

    const medication =
      medications.find(
        (m) => m.id === selectedMedicationId
      ) ?? medications[0];

    setSelectedMedicationId(medication.id);

    if (
      !selectedDose ||
      selectedDose.medId !== medication.id
    ) {
      setSelectedDose({
        medId: medication.id,
        item: medication.schedule[0],
      });
    }
  }, [medications, selectedMedicationId]);

  /* ------------------------------------------------------------------ */
  /* Selected medication                                                */
  /* ------------------------------------------------------------------ */
  const selectedMedication = medications.find( (m) => m.id === selectedMedicationId ) ?? null;

  /* ------------------------------------------------------------------ */
  /* Mutations                                                          */
  /* ------------------------------------------------------------------ */
  const prepareMutation = usePrepareDose(
    selectedDose?.medId
  );

  const administerMutation =
    useAdministerDose(
      selectedDose?.medId
    );

  const selfAdminMutation =
    useSelfAdministerDose(
      selectedDose?.medId
    );

  const skipMutation = useSkipDose(
    selectedDose?.medId
  );

  const isBusy =
    prepareMutation.isPending ||
    administerMutation.isPending ||
    selfAdminMutation.isPending ||
    skipMutation.isPending;

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */
  const getStatus = ( medId: string, item: MedicationScheduleItem ) =>
    statusOverrides[doseKey(medId, item)] ??
    item.status ??
    "planned";

  const updateStatus = ( medId: string, item: MedicationScheduleItem, status: AdministrationStatus, selfAdmin = false ) => {
    const key = doseKey(medId, item);

    setStatusOverrides((prev) => ({
      ...prev,
      [key]: status,
    }));

    if (selfAdmin) {
      setSelfAdminKeys((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
  };

  const selectMedication = ( medication: MedicationWithTodaySchedule ) => {
    setSelectedMedicationId(medication.id);
    setSelectedDose({
      medId: medication.id,
      item: medication.schedule[0],
    });
  };

  const openDialog = (mode: DialogMode) => {
    if (!selectedDose) return;
    setDialogMode(mode);
    setDialogOpen(true);
  };

  /* ------------------------------------------------------------------ */
  /* Actions                                                            */
  /* ------------------------------------------------------------------ */
  async function handlePrepare() {
    const doseId = selectedDose?.item.uid;
    if (!doseId || !selectedDose) return;

    await prepareMutation.mutateAsync(doseId);
    updateStatus(
      selectedDose.medId,
      selectedDose.item,
      "prepared"
    );
  }

  async function handleSaveDialog({ dose, comment, }: { dose: string; comment: string; }) {
    const doseId = selectedDose?.item.uid;
    if (!doseId || !selectedDose) return;

    switch (dialogMode) {
      case "administer":
        await administerMutation.mutateAsync({
          doseId,
          payload: {
            administeredDose: dose,
            comment,
          },
        });

        updateStatus(
          selectedDose.medId,
          selectedDose.item,
          "given"
        );
        break;

      case "selfAdmin":
        await selfAdminMutation.mutateAsync(
          doseId
        );

        updateStatus(
          selectedDose.medId,
          selectedDose.item,
          "given",
          true
        );
        break;

      case "skip":
        await skipMutation.mutateAsync({
          doseId,
          payload: {
            reason: comment || "Skipped",
            comment,
          },
        });

        updateStatus(
          selectedDose.medId,
          selectedDose.item,
          "skipped"
        );
        break;
    }

    setDialogOpen(false);
  }

  return (
    <>
      <div className="grid h-full grid-cols-[420px_1fr] gap-3 p-3">
        {/* Left Panel */}
        <div className="overflow-auto rounded border border-gray-300 bg-white">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">
                  Medication
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  Dosing
                </th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr
                  key={med.id}
                  onClick={() =>
                    selectMedication(med)
                  }
                  className={`cursor-pointer border-t border-gray-200 ${
                    selectedMedicationId === med.id
                      ? "bg-blue-50"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <td className="px-3 py-2">
                    <div className="font-medium">
                      {med.name}
                    </div>
                    {med.strength && (
                      <div className="text-xs text-gray-500">
                        {med.strength}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {med.dosingText}
                  </td>
                </tr>
              ))}

              {!medications.length && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No medications scheduled for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col overflow-hidden rounded border border-gray-300 bg-white">
          <div className="flex-1 overflow-auto">
            {!selectedMedication ? (
              <div className="p-6 text-sm text-gray-500">
                No medication selected.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">
                      Time
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Dose
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMedication.schedule.map(
                    (item) => {
                      const key = doseKey(
                        selectedMedication.id,
                        item
                      );

                      const status = getStatus(
                        selectedMedication.id,
                        item
                      );

                      const isSelected =
                        selectedDose &&
                        doseKey(
                          selectedDose.medId,
                          selectedDose.item
                        ) === key;

                      return (
                        <tr
                          key={key}
                          onClick={() =>
                            setSelectedDose({
                              medId:
                                selectedMedication.id,
                              item,
                            })
                          }
                          className={`cursor-pointer border-t border-gray-200 ${
                            isSelected
                              ? "bg-blue-50"
                              : "hover:bg-blue-50"
                          }`}
                        >
                          <td className="px-3 py-2">
                            {item.time}
                          </td>
                          <td className="px-3 py-2">
                            {item.label}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <DosePillIcon
                                status={status}
                                selfAdmin={
                                  !!selfAdminKeys[key]
                                }
                              />
                              <span>
                                {formatStatus(
                                  status
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2">
            <button
              onClick={handlePrepare}
              disabled={!selectedDose || isBusy}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Prepare
            </button>

            <button
              onClick={() =>
                openDialog("administer")
              }
              disabled={!selectedDose || isBusy}
              className="rounded bg-blue-700 px-3 py-1 text-sm text-white hover:bg-blue-800 disabled:opacity-50"
            >
              Administer
            </button>

            <button
              onClick={() =>
                openDialog("selfAdmin")
              }
              disabled={!selectedDose || isBusy}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Self-admin
            </button>

            <button
              onClick={() =>
                openDialog("skip")
              }
              disabled={!selectedDose || isBusy}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      <AdminActionDialog
        open={dialogOpen}
        mode={dialogMode}
        dose={selectedDose?.item.label ?? ""}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveDialog}
      />
    </>
  );
}