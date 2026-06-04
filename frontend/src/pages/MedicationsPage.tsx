// // src/pages/MedicationsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import type {
  MedicationTabKey,
  PresentationMode,
  MedicationScheduleItem,
  AdministrationStatus,
} from "../features/medications/types";

import { MedicationsTabs } from "../components/medications/medication-core/MedicationsTabs";
import { MedicationsToolbar } from "../components/medications/medication-core/MedicationsToolbar";
import { MedicationListTable } from "../components/medications/medication-core/MedicationListTable";
import { RegisterMedicationDialog } from "../components/medications/medication-core/RegisterMedicationDialog";

import { DispensingView } from "../components/medications/dispensing/DispensingView";
import { VaccinationsView } from "../components/medications/vaccinations/VaccinationsView";
import { NutritionProductsView } from "../components/medications/nutrition/NutritionProductsView";
import { PrescriptionOverviewView } from "../components/medications/prescriptions/PrescriptionOverviewView";
import { NewOrdersView } from "../components/medications/new/NewOrdersView";

import { useMedications } from "../hooks/medications/useMedications";
import {
  usePrepareDose,
  useAdministerDose,
  useSelfAdministerDose,
  useSkipDose,
} from "../hooks/medications/useMedicationDoseActions";

import { mapMedicationDtoToUi } from "../features/medications/medication.mapper";
import { groupMedications } from "../features/medications/groupMedications";

function doseKey(medId: string, item: MedicationScheduleItem): string {
  if (item.uid) return `${medId}|${item.uid}`;
  return `${medId}|${item.date}|${item.time}|${item.label ?? ""}`;
}

type SelectedDose = {
  medId: string;
  item: MedicationScheduleItem;
  key: string;
};

const MedicationsPage = () => {
  const { patientId = "" } = useParams<{ patientId: string }>();

  // Backend data
  const { data: medicationsData = [] } = useMedications(patientId);
  const prepareMutation = usePrepareDose(patientId);
  const administerMutation = useAdministerDose(patientId);
  const selfAdminMutation = useSelfAdministerDose(patientId);
  const skipMutation = useSkipDose(patientId);

  // UI state
  const [tab, setTab] = useState<MedicationTabKey>("medicationList");
  const [mode, setMode] = useState<PresentationMode>("small");
  const [sort, setSort] = useState("nameAsc");
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  const [selectedDose, setSelectedDose] = useState<SelectedDose | null>(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);


  // Administration dialog
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminAction, setAdminAction] = useState<"administer" | "selfAdmin">("administer");
  const [adminDoseText, setAdminDoseText] = useState("");
  const [adminBatch, setAdminBatch] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [adminReason, setAdminReason] = useState("");

  // Status overrides (optimistic UI)
  const [doseStatusOverrides, setDoseStatusOverrides] = useState< Record<string, AdministrationStatus> >({});

  // Map backend data
  const [baseGroups, setBaseGroups] = useState<any[]>([]);

  useEffect(() => {
    const mapped = medicationsData.map(mapMedicationDtoToUi);
    setBaseGroups(groupMedications(mapped));
  }, [medicationsData]);

  // Derived groups
  const groups = useMemo(() => {
    return baseGroups.map((group: any) => ({
      ...group,
      items: [...group.items]
        .sort((a: any, b: any) => {
          if (sort === "nameAsc") {
            return a.name.localeCompare(b.name);
          }
          if (sort === "nameDesc") {
            return b.name.localeCompare(a.name);
          }
          return 0;
        })
        .map((med: any) => ({
          ...med,
          schedule: (med.schedule ?? []).map((dose: any) => {
            const key = doseKey(med.id, dose);
            const override = doseStatusOverrides[key];
            return override ? { ...dose, status: override } : dose;
          }),
        })),
    }));
  }, [baseGroups, sort, doseStatusOverrides]);

  // Helpers
  function setDoseStatus(
    medId: string,
    item: MedicationScheduleItem,
    status: AdministrationStatus
  ) {
    const key = doseKey(medId, item);
    setDoseStatusOverrides((prev) => ({
      ...prev,
      [key]: status,
    }));
  }

  async function onSkip() {
    if (!selectedDose?.item.uid) return;

    try {
      await skipMutation.mutateAsync({
        doseId: selectedDose.item.uid,
        payload: { reason: "Not needed" },
      });

      setDoseStatus(selectedDose.medId, selectedDose.item, "notNeeded");
      toast.success("Dose skipped");
    } catch {
      toast.error("Failed to skip dose");
    }
  }

  async function onPrepare() {
    if (!selectedDose?.item.uid) return;

    try {
      await prepareMutation.mutateAsync(selectedDose.item.uid);

      setDoseStatus(selectedDose.medId, selectedDose.item, "prepared");
      toast.success("Dose prepared");
    } catch {
      toast.error("Failed to prepare dose");
    }
  }

  function openAdminDialog(action: "administer" | "selfAdmin") {
    if (!selectedDose) return;

    setAdminAction(action);
    setAdminDoseText(selectedDose.item.label || "1 dose");
    setAdminBatch("");
    setAdminComment("");
    setAdminReason("");
    setAdminDialogOpen(true);
  }

  async function saveAdministration() {
    if (!selectedDose?.item.uid || !adminDoseText.trim()) return;

    try {
      if (adminAction === "selfAdmin") {
        await selfAdminMutation.mutateAsync(selectedDose.item.uid);
      } else {
        await administerMutation.mutateAsync({
          doseId: selectedDose.item.uid,
          payload: {
            administeredDose: adminDoseText.trim(),
            batchNumber: adminBatch.trim() || undefined,
            comment: adminComment.trim() || undefined,
            reason: adminReason.trim() || undefined,
          },
        });
      }

      setDoseStatus(
        selectedDose.medId,
        selectedDose.item,
        adminAction === "selfAdmin" ? "selfAdmin" : "given"
      );

      setAdminDialogOpen(false);

      toast.success(
        adminAction === "selfAdmin"
          ? "Dose self-administered"
          : "Dose administered"
      );
    } catch {
      toast.error("Failed to save administration");
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded border border-gray-300 bg-white">
        <div className="border-b border-gray-200 px-3 py-2">
          <div className="text-sm font-semibold">Medications</div>
          <div className="text-xs text-gray-600">
            Medication list + schedule
          </div>
        </div>

        <MedicationsTabs value={tab} onChange={setTab} />

        {tab !== "nutritionProducts" && (
          <MedicationsToolbar
            mode={mode}
            onModeChange={setMode}
            sort={sort}
            onSortChange={setSort}
          />
        )}
      </div>

      {/* Content */}
      <div className="rounded border border-gray-300 bg-white">
        {tab === "medicationList" ? (
          <div className="h-[520px] flex flex-col">
            {/* Top action bar */}
            <div className="flex items-center justify-end border-b border-gray-200 px-3 py-2">
              <button
                type="button"
                className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => setRegisterDialogOpen(true)}
              >
                Register…
              </button>
            </div>

            {/* Medication list */}
            <div className="flex-1 overflow-hidden">
              <MedicationListTable
                groups={groups}
                presentation={mode}
                selectedId={selectedMedId}
                onSelect={setSelectedMedId}
              />
            </div>
          </div>
        ) : tab === "dispensingView" ? (
          <div className="h-[520px]">
            <DispensingView groups={groups} />
          </div>
        ) : tab === "vaccinations" ? (
          <div className="h-[520px]">
            <VaccinationsView />
          </div>
        ) : tab === "prescriptionOverview" ? (
          <div className="h-[520px]">
            <PrescriptionOverviewView
              groups={groups}
              presentation={mode}
            />
          </div>
        ) : tab === "nutritionProducts" ? (
           <div className="h-[520px]">
              <NutritionProductsView />
            </div>
        ) : tab === "new" ? (
          <div className="h-[520px]">
            <NewOrdersView
              onSign={() => {}}
              onSignAndOpenList={() => {}}
            />
          </div>
        ) : null}
      </div>

      <RegisterMedicationDialog
        open={registerDialogOpen}
        patientId={patientId}
        onClose={() => setRegisterDialogOpen(false)}
      />

      {/* Administration Dialog */}
      {adminDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-3xl rounded bg-white shadow-lg">
            <div className="border-b px-6 py-4 text-lg font-semibold">
              {adminAction === "selfAdmin"
                ? "Self-administer"
                : "Administer"}
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <input
                className="rounded border px-3 py-2 text-sm"
                value={adminDoseText}
                onChange={(e) => setAdminDoseText(e.target.value)}
                placeholder="Administered dose"
              />

              <input
                className="rounded border px-3 py-2 text-sm"
                value={adminBatch}
                onChange={(e) => setAdminBatch(e.target.value)}
                placeholder="Batch number"
              />

              <textarea
                className="h-28 rounded border px-3 py-2 text-sm"
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Comment"
              />

              <textarea
                className="h-28 rounded border px-3 py-2 text-sm"
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                placeholder="Reason"
              />
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                className="rounded px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                onClick={() => setAdminDialogOpen(false)}
              >
                CANCEL
              </button>

              <button
                className="rounded bg-blue-700 px-5 py-2 text-sm text-white hover:bg-blue-800"
                onClick={saveAdministration}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationsPage;