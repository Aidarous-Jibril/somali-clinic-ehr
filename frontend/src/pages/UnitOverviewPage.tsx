// src/pages/UnitOverviewPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { admitPatient, endCareContact, savePlannedDischarge, } from "../api/inpatient.api";

import { useAuth } from "../context/AuthContext";

import { useActiveContacts } from "../hooks/inpatient/useActiveContacts";
import { useChangeBed } from "../hooks/inpatient/useChangeBed";
import { useCoordination } from "../hooks/inpatient/useCoordination";
import { usePatientLog } from "../hooks/patient/usePatientLog";
import { usePlanTransfer } from "../hooks/inpatient/usePlanTransfer";
import { useReserveBed } from "../hooks/inpatient/useReserveBed";
import { useSaveCoordination } from "../hooks/inpatient/useSaveCoordination";
import { useTeams } from "../hooks/staff/useTeams";
import { useTransferNow } from "../hooks/inpatient/useTransferNow";
import { useTransfers } from "../hooks/inpatient/useTransfers";
import { useUnits } from "../hooks/staff/useUnits";

import { UnitOverviewHeader } from "../components/unit-overview/UnitOverviewHeader";
import { UnitOverviewTabs } from "../components/unit-overview/UnitOverviewTabs";
import { UnitOverviewFilters } from "../components/unit-overview/UnitOverviewFilters";
import { ActiveContactsTable } from "../components/unit-overview/ActiveContactsTable";
import { TransfersTable } from "../components/unit-overview/TransfersTable";

import AdmitPatientDialog from "../features/unit-overview/dialogs/AdmitPatientDialog";
import ChangeBedDialog from "../features/unit-overview/dialogs/ChangeBedDialog";
import CoordinationDialog from "../features/unit-overview/dialogs/CoordinationDialog";
import EwsDialog from "../features/unit-overview/dialogs/EwsDialog";
import EwsLogDialog from "../features/unit-overview/dialogs/EwsLogDialog";
import PatientCardDialog from "../features/unit-overview/dialogs/PatientCardDialog";
import PatientLogDialog from "../features/unit-overview/dialogs/PatientLogDialog";
import PlannedDischargeDialog from "../features/unit-overview/dialogs/PlannedDischargeDialog";
import ReserveBedDialog from "../features/unit-overview/dialogs/ReserveBedDialog";
import TransferPatientDialog from "../features/unit-overview/dialogs/TransferPatientDialog";

import { allBeds, bedOptions } from "../features/unit-overview/unitOverviewMockData";

import type { UnitOverviewTabKey } from "../features/unit-overview/unitOverviewConstants";
import type {
  AdmitPatientData,
  BedChangeOption,
  BedOption,
  BedSelectOption,
  CoordinationData,
  Inpatient,
  Transfer,
} from "../features/unit-overview/types";

// ------------------------------------------------------
// Local types
// ------------------------------------------------------

type MenuPosition = { x: number; y: number };

type DialogKey =
  | "admit"
  | "card"
  | "log"
  | "discharge"
  | "reserveBed"
  | "transfer"
  | "planTransfer"
  | "ews"
  | "ewsLog"
  | "changeBed"
  | "coordination";

const INITIAL_DIALOGS: Record<DialogKey, boolean> = {
  admit: false,
  card: false,
  log: false,
  discharge: false,
  reserveBed: false,
  transfer: false,
  planTransfer: false,
  ews: false,
  ewsLog: false,
  changeBed: false,
  coordination: false,
};

// ------------------------------------------------------
// Page
// ------------------------------------------------------

export default function UnitOverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // UI state
  const [tab, setTab] = useState<UnitOverviewTabKey>("active");
  const [showEmptyBeds, setShowEmptyBeds] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Inpatient | null>(null);
  const [menu, setMenu] = useState<MenuPosition | null>(null);
  const [dialogs, setDialogs] = useState(INITIAL_DIALOGS);
  const [selectedWard, setSelectedWard] = useState("");

  // Data
  const { data: realUnits = [] } = useUnits(user?.clinicId);
  const selectedUnit = realUnits.find((u: any) => u.name === selectedWard);

  const { data: inpatients = [], isLoading, refetch } = useActiveContacts();
  const { data: transfers = [] } = useTransfers(user?.clinicId, user?.unitId);
  const { data: teams = [] } = useTeams(user?.clinicId, selectedUnit?.id);

  const { data: patientEntries = [], isLoading: logLoading } = usePatientLog(
    selectedPatient?.id,
    dialogs.log
  );

  const { data: coordinationData, isLoading: coordinationLoading } =
    useCoordination(selectedPatient?.id, dialogs.coordination);

  // Mutations
  const changeBedMutation = useChangeBed();
  const saveCoordinationMutation = useSaveCoordination();
  const planTransferMutation = usePlanTransfer();
  const reserveBedMutation = useReserveBed();
  const transferNowMutation = useTransferNow();

  // ------------------------------------------------------
  // Helpers
  // ------------------------------------------------------

  const open = (key: DialogKey) => {
    setDialogs((prev) => ({ ...prev, [key]: true }));
    setMenu(null);
  };

  const close = (key: DialogKey) =>
    setDialogs((prev) => ({ ...prev, [key]: false }));

  const patientRoute = (patient: Inpatient) => patient.patientId || patient.id;

  const goToPatient = (patient: Inpatient) => {
    const id = patientRoute(patient);
    if (!id) return toast.error("Patient id missing");

    navigate(`/patients/${encodeURIComponent(id)}`);
    setMenu(null);
  };

  // Close context menu on outside click
  useEffect(() => {
    if (!menu) return;

    const closeMenu = () => setMenu(null);

    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [menu]);

  // ------------------------------------------------------
  // Derived data
  // ------------------------------------------------------

  const occupiedBeds = useMemo(
    () => new Set(inpatients.map((p) => p.bed)),
    [inpatients]
  );

  const admissionBeds: BedSelectOption[] = useMemo(
    () =>
      allBeds.map((bed) => ({
        id: bed,
        label: bed,
        disabled: occupiedBeds.has(bed),
      })),
    [occupiedBeds]
  );

  const reserveBeds: BedOption[] = useMemo(
    () =>
      bedOptions.map((bed) => ({
        id: bed.code,
        label: bed.code,
        status:
          bed.status === "Available"
            ? "free"
            : bed.status === "Reserved"
            ? "reserved"
            : "occupied",
      })),
    []
  );

  const changeBeds: BedChangeOption[] = useMemo(
    () =>
      allBeds.map((bed) => ({
        id: bed,
        label: bed,
        status: inpatients.some(
          (p) => p.bed === bed && selectedPatient?.bed !== bed
        )
          ? "occupied"
          : "free",
      })),
    [inpatients, selectedPatient]
  );

  // ------------------------------------------------------
  // Actions
  // ------------------------------------------------------

  const openContextMenu = (
    e: React.MouseEvent<HTMLTableRowElement>,
    patient: Inpatient
  ) => {
    e.preventDefault();
    setSelectedPatient(patient);
    setMenu({ x: e.clientX + 2, y: e.clientY - 6 });
  };

  const saveDischarge = async (data: {
    date: string;
    time: string;
    status: string;
  }) => {
    if (!selectedPatient?.id) return;

    try {
      await savePlannedDischarge({
        stayId: selectedPatient.id,
        ...data,
      });

      await refetch();
      toast.success("Planned discharge saved");
      close("discharge");
    } catch {
      toast.error("Failed to save planned discharge");
    }
  };

  const handleChangeBed = async (bedId: string | null) => {
    if (!selectedPatient?.id || !bedId) return;

    try {
      await changeBedMutation.mutateAsync({
        stayId: selectedPatient.id,
        bedCode: bedId,
      });

      toast.success("Bed changed");
      close("changeBed");
    } catch {
      toast.error("Failed to change bed");
    }
  };

  const handleSaveCoordination = async (data: CoordinationData) => {
    if (!selectedPatient?.id) return;

    try {
      await saveCoordinationMutation.mutateAsync({
        stayId: selectedPatient.id,
        ...data,
      });

      toast.success("Coordination saved");
      close("coordination");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to save coordination"
      );
    }
  };

  const handlePlanTransfer = async (data: any) => {
    if (!selectedPatient || !user) return;

    try {
      await planTransferMutation.mutateAsync({
        stayId: selectedPatient.id,
        staffId: user.id,
        clinicId: user.clinicId,
        ...data,
      });

      toast.success("Transfer planned");
      close("planTransfer");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to plan transfer");
    }
  };

  const handleReserveBed = async (transfer: Transfer) => {
    if (!selectedPatient?.bed) return;

    try {
      await reserveBedMutation.mutateAsync({
        referralId: transfer.id,
        bedCode: selectedPatient.bed,
      });

      toast.success("Bed reserved");
    } catch {
      toast.error("Failed to reserve bed");
    }
  };

  const handleTransferNow = async (transfer: Transfer) => {
    try {
      await transferNowMutation.mutateAsync({
        referralId: transfer.id,
      });

      toast.success("Patient transferred");
      refetch();
    } catch {
      toast.error("Transfer failed");
    }
  };

  const handleEndCareContact = async () => {
    if (!selectedPatient?.id) return;

    const confirmed = window.confirm(
      `End care contact for ${selectedPatient.name}?`
    );

    if (!confirmed) return;

    try {
      await endCareContact(selectedPatient.id);
      toast.success("Care contact ended");
      setMenu(null);
      refetch();
    } catch {
      toast.error("Failed to end care contact");
    }
  };

  const handleAdmitPatient = async (form: AdmitPatientData) => {
    if (!user?.clinicId) {
      toast.error("Clinic missing");
      return;
    }

    try {
      await admitPatient({
        ...form,
        clinicId: user.clinicId,
      });

      toast.success("Patient admitted");
      close("admit");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to admit patient");
    }
  };

  // ------------------------------------------------------
  // Menu
  // ------------------------------------------------------

  const menuItems: [string, () => void][] = [
    ["New EWS...", () => open("ews")],
    ["EWS log...", () => open("ewsLog")],
    ["Patient card...", () => open("card")],
    ["Admission & discharge...", () => open("discharge")],
    ["Place / bed...", () => open("changeBed")],
    ["Patient log...", () => open("log")],
    ["Coordination...", () => open("coordination")],
    [
      "Journal...",
      () =>
        selectedPatient &&
        navigate(`/patients/${patientRoute(selectedPatient)}/journal`),
    ],
    ["Plan transfer...", () => open("planTransfer")],
    [
      "Patient overview...",
      () => selectedPatient && goToPatient(selectedPatient),
    ],
  ];

  // ------------------------------------------------------
  // Render
  // ------------------------------------------------------

  return (
    <div className="space-y-4 text-sm">
      <UnitOverviewHeader onAdmitClick={() => open("admit")} />

      <UnitOverviewTabs value={tab} onChange={setTab} />

      <UnitOverviewFilters
        showEmptyBeds={showEmptyBeds}
        onToggleEmptyBeds={setShowEmptyBeds}
      />

      {isLoading ? (
        <div className="rounded border bg-white p-6 text-center text-gray-500">
          Loading active contacts...
        </div>
      ) : tab === "active" ? (
        <ActiveContactsTable
          inpatients={inpatients}
          allBeds={allBeds}
          showEmptyBeds={showEmptyBeds}
          onRowClick={goToPatient}
          onRowContextMenu={openContextMenu}
          onOpenCoordination={(patient) => {
            setSelectedPatient(patient);
            open("coordination");
          }}
        />
      ) : (
        <TransfersTable
          transfers={transfers}
          onReserveBedClick={handleReserveBed}
          onTransferNowClick={handleTransferNow}
        />
      )}

      {menu && selectedPatient && (
        <div
          className="fixed z-50 w-64 rounded border border-gray-300 bg-white shadow-xl"
          style={{ top: menu.y, left: menu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {menuItems.map(([label, action]) => (
            <button
              key={label}
              onClick={action}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              {label}
            </button>
          ))}

          <div className="border-t" />

          <button
            onClick={handleEndCareContact}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
          >
            End care contact...
          </button>
        </div>
      )}

      <AdmitPatientDialog
        open={dialogs.admit}
        defaultWard={realUnits[0]?.name || ""}
        defaultTeam={teams[0]?.name || ""}
        wards={realUnits.map((u: any) => u.name)}
        teams={teams.map((t: any) => t.name)}
        beds={admissionBeds}
        onClose={() => close("admit")}
        onSave={handleAdmitPatient}
      />

      <PatientCardDialog
        open={dialogs.card}
        patient={selectedPatient}
        onClose={() => close("card")}
      />

      <PatientLogDialog
        open={dialogs.log}
        patient={selectedPatient}
        entries={patientEntries}
        loading={logLoading}
        onClose={() => close("log")}
      />

      <PlannedDischargeDialog
        open={dialogs.discharge}
        patient={selectedPatient}
        onClose={() => close("discharge")}
        onSave={saveDischarge}
      />

      <ReserveBedDialog
        open={dialogs.reserveBed}
        beds={reserveBeds}
        onClose={() => close("reserveBed")}
        onReserve={() => {}}
      />

      <TransferPatientDialog
        open={dialogs.planTransfer}
        transfer={{
          id: selectedPatient?.id || "",
          direction: "outbound",
          type: "Same episode",
          name: selectedPatient?.name || "",
          nationalId: selectedPatient?.nationalId || "",
          fromFacility: "",
          toFacility: "",
          fromUnit: "",
          toUnit: "",
          transferTime: "",
          status: "planned",
        }}
        onClose={() => close("planTransfer")}
        onTransfer={handlePlanTransfer}
        confirmLabel="Save"
      />

      <EwsDialog
        open={dialogs.ews}
        patient={selectedPatient}
        onClose={() => close("ews")}
        onSaved={refetch}
      />

      <EwsLogDialog
        open={dialogs.ewsLog}
        patient={selectedPatient}
        onClose={() => close("ewsLog")}
      />

      <ChangeBedDialog
        open={dialogs.changeBed}
        patient={selectedPatient}
        beds={changeBeds}
        onClose={() => close("changeBed")}
        onChangeBed={handleChangeBed}
      />

      <CoordinationDialog
        open={dialogs.coordination}
        patient={selectedPatient}
        availableUnits={realUnits.map((u: any) => u.name)}
        initialData={coordinationLoading ? undefined : coordinationData}
        onClose={() => close("coordination")}
        onSave={handleSaveCoordination}
      />
    </div>
  );
}