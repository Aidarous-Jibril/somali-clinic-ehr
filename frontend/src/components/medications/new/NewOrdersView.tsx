// src/features/medications/components/new-orders/NewOrdersView.tsx

import { useEffect, useMemo, useState } from "react";
import { TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FavoritesTable } from "./FavoritesTable";
import { TreatmentInfoPanel } from "./TreatmentInfoPanel";
import { OrderPreview } from "./OrderPreview";
import { RegisterMedicationDialog } from "../medication-core/RegisterMedicationDialog";

import { useMedicationFavorites } from "../../../hooks/medications/useMedicationFavorites";
import { useCreateMedication } from "../../../hooks/medications/useCreateMedication";

import type { MedicationFormValues } from "../../../schemas/medication.schema";

type Props = {
  onSign: (templateId: string) => void;
  onSignAndOpenList: (templateId: string) => void;
};

// Temporary shape used by this view.
// You can later replace this with a shared type from your API layer.
type FavoriteTemplate = {
  id: string;
  treatmentReason?: string;
  templateName?: string;
  product?: string;
  form?: string;
  strength?: string;
  dosing?: string;

  // Extended backend fields
  name?: string;
  dose?: string;
  frequency?:
    | "once_daily"
    | "twice_daily"
    | "three_times_daily"
    | "four_times_daily"
    | "as_needed";
  groupType?:
    | "current"
    | "prn"
    | "notScheduled"
    | "generalDirective";
  dosingText?: string;
  indication?: string;
  strengthValue?: string;
  formValue?: string;
  route?:
    | "oral"
    | "intravenous"
    | "intramuscular"
    | "subcutaneous"
    | "inhalation"
    | "topical"
    | "rectal"
    | "ophthalmic"
    | "otic"
    | "nasal"
    | "other";
  notes?: string;
};

export function NewOrdersView({
  onSign,
  onSignAndOpenList,
}: Props) {
  const { patientId = "" } =
    useParams<{ patientId: string }>();

  const createMedicationMutation =
    useCreateMedication();

  const {
    data: favoriteTemplates = [],
    isLoading: favoritesLoading,
  } = useMedicationFavorites();

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] =
    useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] =
    useState(false);

  /**
   * Filter favorites by search text.
   */
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return favoriteTemplates as FavoriteTemplate[];
    }

    return (
      favoriteTemplates as FavoriteTemplate[]
    ).filter((row) =>
      [
        row.treatmentReason,
        row.templateName,
        row.product,
        row.form,
        row.strength,
        row.dosing,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, favoriteTemplates]);

  /**
   * Keep selection valid when data or filters change.
   */
  useEffect(() => {
    if (!rows.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId) {
      setSelectedId(rows[0].id);
      return;
    }

    const stillVisible = rows.some(
      (row) => row.id === selectedId
    );

    if (!stillVisible) {
      setSelectedId(rows[0].id);
    }
  }, [rows, selectedId]);

  /**
   * Currently selected favorite template.
   */
  const selected = useMemo(
    () =>
      rows.find((row) => row.id === selectedId) ??
      null,
    [rows, selectedId]
  );

  const canSign = Boolean(selected?.id);

  /**
   * Build payload sent to backend when clicking
   * Sign or Sign and open the list.
   */
  const buildMedicationPayload =
    (): MedicationFormValues | null => {
      if (!selected) return null;

      return {
        patientId,

        // Core medication fields
        name:
          selected.name ||
          selected.product ||
          "",
        strength:
          selected.strengthValue ||
          selected.strength ||
          "",
        dose:
          selected.dose ||
          selected.dosing ||
          "",
        dosingText:
          selected.dosingText ||
          selected.dose ||
          selected.dosing ||
          "",
        indication:
          selected.indication ||
          selected.treatmentReason ||
          "",

        // Scheduling
        frequency:
          selected.frequency ||
          "once_daily",
        groupType:
          selected.groupType ||
          "current",

        // Additional metadata
        form:
          selected.formValue ||
          selected.form ||
          "",
        route: selected.route,
        notes:
          selected.notes || "",
      };
    };

  /**
   * Create medication and stay on current view.
   */
  const handleSign = async () => {
    const payload =
      buildMedicationPayload();

    if (!payload || !selected) return;

    try {
      const result =
        await createMedicationMutation.mutateAsync(
          payload
        );

      toast.success(
        result?.message ||
          "Medication registered successfully"
      );

      onSign(selected.id);
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to register medication"
      );
    }
  };

  /**
   * Create medication and switch to
   * Medication List tab.
   */
  const handleSignAndOpenList =
    async () => {
      const payload =
        buildMedicationPayload();

      if (!payload || !selected) return;

      try {
        const result =
          await createMedicationMutation.mutateAsync(
            payload
          );

        toast.success(
          result?.message ||
            "Medication registered successfully"
        );

        onSignAndOpenList(selected.id);
      } catch (error) {
        console.error(error);
        toast.error(
          "Failed to register medication"
        );
      }
    };

  /**
   * Initial values for Register Medication dialog.
   */
  const dialogInitialValues:
    | Partial<MedicationFormValues>
    | undefined = selected
    ? {
        name:
          selected.name ||
          selected.product ||
          "",
        strength:
          selected.strengthValue ||
          selected.strength ||
          "",
        dose:
          selected.dose ||
          selected.dosing ||
          "",
        dosingText:
          selected.dosingText ||
          selected.dose ||
          selected.dosing ||
          "",
        indication:
          selected.indication ||
          selected.treatmentReason ||
          "",
        frequency:
          selected.frequency ||
          "once_daily",
        groupType:
          selected.groupType ||
          "current",
        form:
          selected.formValue ||
          selected.form ||
          "",
        route: selected.route,
        notes:
          selected.notes || "",
      }
    : undefined;

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      {/* Search and filters */}
      <div className="grid gap-2 md:grid-cols-[1fr_320px]">
        <div className="rounded border border-gray-200 bg-white p-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs text-gray-600">
              Search for
            </div>

            <TextField
              size="small"
              placeholder="Fritextsök: Mall, produkt, generika, ATC-kod…"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              fullWidth
            />
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-white p-2">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Filter results
            </div>

            <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[1.35fr_0.65fr]">
        <div className="min-h-0">
          <FavoritesTable
            rows={rows}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId(id)
            }
            loading={favoritesLoading}
          />
        </div>

        <div className="min-h-0 overflow-auto">
          <TreatmentInfoPanel />
        </div>
      </div>

      {/* Preview and actions */}
      <div className="rounded border border-gray-200 bg-white p-3">
        <OrderPreview selected={selected} />

        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <button
            className="rounded border border-gray-300 bg-white px-3 py-1 text-xs"
            onClick={() =>
              setDetailsOpen(true)
            }
            disabled={!selected}
          >
            Order details…
          </button>

          <button
            className={
              "rounded border px-3 py-1 text-xs " +
              (canSign
                ? "border-gray-300 bg-white"
                : "border-gray-200 bg-gray-100 text-gray-400")
            }
            onClick={
              handleSignAndOpenList
            }
            disabled={
              !canSign ||
              createMedicationMutation.isPending
            }
          >
            {createMedicationMutation.isPending
              ? "Signing..."
              : "Sign and open the list"}
          </button>

          <button
            className={
              "rounded px-3 py-1 text-xs text-white " +
              (canSign
                ? "bg-blue-600"
                : "bg-blue-300")
            }
            onClick={handleSign}
            disabled={
              !canSign ||
              createMedicationMutation.isPending
            }
          >
            {createMedicationMutation.isPending
              ? "Signing..."
              : "Sign"}
          </button>
        </div>
      </div>

      {/* Register Medication Dialog */}
      {selected && (
        <RegisterMedicationDialog
          open={detailsOpen}
          patientId={patientId}
          onClose={() =>
            setDetailsOpen(false)
          }
          onSuccess={() =>
            onSign(selected.id)
          }
          initialValues={
            dialogInitialValues
          }
        />
      )}
    </div>
  );
}