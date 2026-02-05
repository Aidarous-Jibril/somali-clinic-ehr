// src/pages/UnitOverviewPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
import PlannedDischargeDialog, {
  type PlannedDischargeData,
} from "../features/unit-overview/dialogs/PlannedDischargeDialog";
import ReserveBedDialog from "../features/unit-overview/dialogs/ReserveBedDialog";
import TransferPatientDialog from "../features/unit-overview/dialogs/TransferPatientDialog";


import type {
  AdmitPatientData,
  BedChangeOption,
  BedOption,
  BedSelectOption,
  CoordinationData,
  EwsEntry,
  Inpatient,
  PlannedDischarge,
  PlannedDischargeStatus,
  Transfer,
  TransferPatientData,
  TransferStatus,
} from "../features/unit-overview/types";
import {
  allBeds,
  bedOptions,
  facilityOptions,
  sampleCoordinationCases,
  sampleInpatients,
  samplePatientLogs,
  sampleTransfers,
  unitOptions,
  unitsByFacility,
} from "../features/unit-overview/mockData";


import type { EwsMeasurementData } from "../features/unit-overview/dialogs/EwsDialog";
import type { UnitOverviewTabKey } from "../features/unit-overview/constants";

function makeId(prefix = "t") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

const UnitOverviewPage = () => {
  const navigate = useNavigate();

  // --------------------------------------------------
  // State: core lists + tabs
  // --------------------------------------------------

  const [tab, setTab] = useState<UnitOverviewTabKey>("active");
  const [inpatients, setInpatients] = useState<Inpatient[]>(sampleInpatients);
  const [transfers, setTransfers] = useState<Transfer[]>(sampleTransfers);

  // --------------------------------------------------
  // State: selection + context menu
  // --------------------------------------------------
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [selectedInpatient, setSelectedInpatient] = useState<Inpatient | null>(null);

  // --------------------------------------------------
  // State: UI toggles
  // --------------------------------------------------
  const [showEmptyBeds, setShowEmptyBeds] = useState(true);

  // --------------------------------------------------
  // State: read-only patient log (mock)
  // --------------------------------------------------
  const [patientLogs] = useState(samplePatientLogs);

  // --------------------------------------------------
  // State: dialog open/close flags
  // --------------------------------------------------
  const [openPatientCard, setOpenPatientCard] = useState(false);
  const [openPatientLogDialog, setOpenPatientLogDialog] = useState(false);
  const [openDischargeDialog, setOpenDischargeDialog] = useState(false);
  const [openAdmissionDialog, setOpenAdmissionDialog] = useState(false);
  const [openBedDialog, setOpenBedDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openPlanTransferDialog, setOpenPlanTransferDialog] = useState(false);
  const [openEwsDialog, setOpenEwsDialog] = useState(false);
  const [openEwsLogDialog, setOpenEwsLogDialog] = useState(false);
  const [openBedChangeDialog, setOpenBedChangeDialog] = useState(false);
  const [openCoordinationDialog, setOpenCoordinationDialog] = useState(false);

  // --------------------------------------------------
  // State: transfer selection
  // --------------------------------------------------
  const [selectedTransferForBed, setSelectedTransferForBed] = useState<Transfer | null>(null);
  const [selectedTransferForAction, setSelectedTransferForAction] = useState<Transfer | null>(null);
  const [outboundTransferDraft, setOutboundTransferDraft] = useState<Transfer | null>(null);

  // --------------------------------------------------
  // State: EWS logs
  // --------------------------------------------------
  const [ewsLogs, setEwsLogs] = useState<Record<string, EwsEntry[]>>({});

  // --------------------------------------------------
  // State: Coordination (cases per patient)
  // --------------------------------------------------
  const [coordinationCases, setCoordinationCases] = useState<Record<string, CoordinationData>>(() => sampleCoordinationCases);
  const [coordinationTargetId, setCoordinationTargetId] = useState<string | null>(null);

  // --------------------------------------------------
  // Derived data (useMemo)
  // --------------------------------------------------

  // Admission bed dropdown options (disable occupied beds)
  const admissionBedOptions: BedSelectOption[] = useMemo(() => {
    const occupied = new Set(inpatients.map((p) => p.bed));
    return allBeds.map((b) => ({
      id: b,
      label: b,
      disabled: occupied.has(b),
    }));
  }, [inpatients]);

  // Reserve-bed dialog options (from mock bedOptions)
  const reserveBedOptions: BedOption[] = useMemo(() => {
    return bedOptions.map((b) => ({
      id: b.code,
      label: b.code,
      status: b.status === "Available" ? "free" : b.status === "Reserved" ? "reserved" : "occupied",
    }));
  }, []);

  // Change-bed dialog options (occupied/free based on current inpatients)
  const changeBedOptions: BedChangeOption[] = useMemo(() => {
    return allBeds.map((bedCode) => {
      const occupant = inpatients.find((p) => p.bed === bedCode);
      const isCurrent = selectedInpatient && selectedInpatient.bed === bedCode;
      const isOccupied = !!occupant && !isCurrent;
      return { id: bedCode, label: bedCode, status: isOccupied ? "occupied" : "free" };
    });
  }, [inpatients, selectedInpatient]);

  // --------------------------------------------------
  // Effects
  // --------------------------------------------------

  // Close context menu on click anywhere
  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  // --------------------------------------------------
  // Handlers: context menu
  // --------------------------------------------------
  const handleRowContextMenu = (e: React.MouseEvent<HTMLTableRowElement>, patient: Inpatient) => {
    e.preventDefault();
    setSelectedInpatient(patient);
    setContextMenu(contextMenu === null ? { mouseX: e.clientX + 2, mouseY: e.clientY - 6 } : null);
  };

  // --------------------------------------------------
  // Handlers: navigation
  // --------------------------------------------------
  const openPatientOverview = () => {
    if (!selectedInpatient) return;
    const idParam = encodeURIComponent(selectedInpatient.nationalId);
    navigate(`/patients/${idParam}`);
  };

  const openJournal = () => navigate("/journal");

  // --------------------------------------------------
  // Handlers: admission
  // --------------------------------------------------
  const handleOpenAdmission = () => setOpenAdmissionDialog(true);

  const handleSaveAdmission = (data: AdmitPatientData) => {
    if (!data.nationalId.trim() || !data.name.trim() || !data.bed.trim()) {
      toast.error("National ID, name and bed must be filled in.");
      return;
    }

    // Prevent admitting into an already occupied bed
    const bedTaken = inpatients.some((p) => p.bed === data.bed);
    if (bedTaken) {
      toast.error(`Bed ${data.bed} is already occupied.`);
      return;
    }

    const newInpatient: Inpatient = {
      bed: data.bed,
      nationalId: data.nationalId,
      name: data.name,
      ews: data.ews ? Number(data.ews) : undefined,
      facility: "Somali Clinic - Hargeisa",
      ward: data.ward,
      team: data.team,
      startDate: `${data.startDate} ${data.startTime}`,
      activity: "",
      absence: "",
    };

    setInpatients((prev) => [...prev, newInpatient]);
    toast.success("Patient admitted to the unit.");
    setOpenAdmissionDialog(false);
  };

  // --------------------------------------------------
  // Handlers: planned discharge
  // --------------------------------------------------
  const openDischarge = () => {
    if (!selectedInpatient) return;
    setOpenDischargeDialog(true);
  };

  const handleSavePlannedDischarge = (data: PlannedDischargeData) => {
    if (!selectedInpatient) return;

    const updated: PlannedDischarge = {
      dateTime: `${data.date} ${data.time}`,
      status: data.status as PlannedDischargeStatus,
    };

    setInpatients((prev) =>
      prev.map((p) =>
        p.bed === selectedInpatient.bed && p.nationalId === selectedInpatient.nationalId ? { ...p, plannedDischarge: updated } : p
      )
    );

    setSelectedInpatient((prev) => (prev ? { ...prev, plannedDischarge: updated } : prev));

    toast.success("Planned discharge updated.");
    setOpenDischargeDialog(false);
  };

  // --------------------------------------------------
  // Handlers: EWS
  // --------------------------------------------------
  const handleOpenNewEws = () => {
    if (!selectedInpatient) return;
    setOpenEwsDialog(true);
    setContextMenu(null);
  };

  const handleOpenEwsLog = () => {
    if (!selectedInpatient) return;
    setOpenEwsLogDialog(true);
    setContextMenu(null);
  };

  const handleSaveNewEws = (data: EwsMeasurementData) => {
    if (!selectedInpatient) return;

    const scoreNum = Number(data.score);
    if (Number.isNaN(scoreNum)) {
      toast.error("NEWS / EWS score must be a number.");
      return;
    }

    const key = selectedInpatient.nationalId;

    setInpatients((prev) =>
      prev.map((p) =>
        p.bed === selectedInpatient.bed && p.nationalId === selectedInpatient.nationalId ? { ...p, ews: scoreNum } : p
      )
    );

    setEwsLogs((prev) => {
      const list = prev[key] || [];
      return { ...prev, [key]: [...list, { dateTime: data.dateTime, score: scoreNum }] };
    });

    toast.success("New EWS / NEWS registered.");
    setOpenEwsDialog(false);
  };

  // --------------------------------------------------
  // Handlers: patient log
  // --------------------------------------------------
  const openPatientLog = () => {
    if (!selectedInpatient) return;
    setOpenPatientLogDialog(true);
    setContextMenu(null);
  };

  // --------------------------------------------------
  // Handlers: inbound transfers (reserve bed + transfer now)
  // --------------------------------------------------
  const handleOpenBedReservation = (transfer: Transfer) => {
    setSelectedTransferForBed(transfer);
    setOpenBedDialog(true);
  };

  const handleReserveBed = (bedId: string | null) => {
    if (!selectedTransferForBed) {
      setOpenBedDialog(false);
      return;
    }
    if (!bedId) {
      toast.error("Please select a bed to reserve.");
      return;
    }

    setTransfers((prev) => prev.map((t) => (t.id === selectedTransferForBed.id ? { ...t, bedReserved: bedId } : t)));

    toast.success(`Bed ${bedId} reserved for transfer.`);
    setOpenBedDialog(false);
    setSelectedTransferForBed(null);
  };

  const handleOpenTransferDialog = (transfer: Transfer) => {
    if (!transfer.bedReserved) {
      toast.error("Please reserve a bed before transferring the patient.");
      return;
    }
    setSelectedTransferForAction(transfer);
    setOpenTransferDialog(true);
  };

  const handleTransferPatientInbound = (data: TransferPatientData) => {
    if (!selectedTransferForAction || !selectedTransferForAction.bedReserved) {
      toast.error("Bed must be reserved before transfer.");
      return;
    }

    const updatedTransferTime = `${data.transferDate} ${data.transferTime}`;

    const newInpatient: Inpatient = {
      bed: selectedTransferForAction.bedReserved,
      nationalId: selectedTransferForAction.nationalId,
      name: selectedTransferForAction.name,
      facility: data.toFacility || "Somali Clinic - Hargeisa",
      ward: data.toUnit,
      team: "Blue team",
      startDate: updatedTransferTime,
      ews: undefined,
      activity: "",
      absence: "",
    };

    setInpatients((prev) => [...prev, newInpatient]);

    setTransfers((prev) =>
      prev.map((t) =>
        t.id === selectedTransferForAction.id
          ? {
              ...t,
              fromFacility: data.fromFacility,
              toFacility: data.toFacility,
              fromUnit: data.fromUnit,
              toUnit: data.toUnit,
              transferTime: updatedTransferTime,
              status: "completedToday" as TransferStatus,
            }
          : t
      )
    );

    toast.success("Patient transferred and admitted to the unit.");
    setOpenTransferDialog(false);
    setSelectedTransferForAction(null);
  };

  // --------------------------------------------------
  // Handlers: bed change
  // --------------------------------------------------
  const openBedChange = () => {
    if (!selectedInpatient) return;
    setOpenBedChangeDialog(true);
    setContextMenu(null);
  };

  const handleChangeBed = (bedId: string | null) => {
    if (!selectedInpatient || !bedId) {
      setOpenBedChangeDialog(false);
      return;
    }

    setInpatients((prev) => prev.map((p) => (p.nationalId === selectedInpatient.nationalId ? { ...p, bed: bedId } : p)));

    toast.success(`Bed changed to ${bedId}`);
    setOpenBedChangeDialog(false);
  };

  // --------------------------------------------------
  // Handlers: outbound transfers (plan transfer)
  // --------------------------------------------------
  const openPlanTransfer = () => {
    if (!selectedInpatient) return;

    const now = new Date();
    const d = now.toISOString().slice(0, 10);
    const hh = `${now.getHours()}`.padStart(2, "0");
    const mm = `${now.getMinutes()}`.padStart(2, "0");

    const draft: Transfer = {
      id: makeId("out"),
      direction: "outbound",
      type: "Outbound transfer",
      name: selectedInpatient.name,
      nationalId: selectedInpatient.nationalId,

      fromFacility: selectedInpatient.facility,
      toFacility: "Hargeisa General Hospital",

      fromUnit: selectedInpatient.ward,
      toUnit: "Emergency dept",

      transferTime: `${d} ${hh}:${mm}`,
      status: "planned",

      technicalUnit: "",
      specialBedNeeds: "",
      reason: "",
      transferDecided: false,
      patientReady: false,
    };

    setOutboundTransferDraft(draft);
    setOpenPlanTransferDialog(true);
    setContextMenu(null);
  };

  const handleSaveOutboundTransfer = (data: TransferPatientData) => {
    if (!selectedInpatient || !outboundTransferDraft) return;

    if (!data.toFacility.trim()) {
      toast.error("Transfer to facility is required.");
      return;
    }
    if (!data.toUnit.trim()) {
      toast.error("Transfer to unit is required.");
      return;
    }

    const transferTime = `${data.transferDate} ${data.transferTime}`;

    const newTransfer: Transfer = {
      id: makeId("out"),
      direction: "outbound",
      type: "Outbound transfer",
      name: selectedInpatient.name,
      nationalId: selectedInpatient.nationalId,

      fromFacility: data.fromFacility,
      toFacility: data.toFacility,
      fromUnit: data.fromUnit,
      toUnit: data.toUnit,

      transferTime,
      technicalUnit: data.technicalUnit,
      specialBedNeeds: data.specialBedNeeds,
      reason: data.reason,
      transferDecided: data.transferDecided,
      patientReady: data.patientReady,

      status: data.transferDecided && data.patientReady ? "completedToday" : "planned",
    };

    setTransfers((prev) => [newTransfer, ...prev]);

    if (newTransfer.status === "completedToday") {
      setInpatients((prev) => prev.filter((p) => p.nationalId !== selectedInpatient.nationalId));
      toast.success("Outbound transfer completed. Patient removed from active contacts.");
    } else {
      toast.success("Outbound transfer planned and saved.");
    }

    setOpenPlanTransferDialog(false);
    setOutboundTransferDraft(null);
  };

  // --------------------------------------------------
  // Handlers: coordination
  // --------------------------------------------------
  const openCoordination = () => {
    if (!selectedInpatient) return;
    setCoordinationTargetId(selectedInpatient.nationalId);
    setOpenCoordinationDialog(true);
    setContextMenu(null);
  };

  const openCoordinationForPatient = (patient: Inpatient) => {
    setSelectedInpatient(patient);
    setCoordinationTargetId(patient.nationalId);
    setOpenCoordinationDialog(true);
  };

  const handleSaveCoordination = (data: CoordinationData) => {
    const id = coordinationTargetId ?? selectedInpatient?.nationalId;
    if (!id) return;

    setCoordinationCases((prev) => ({ ...prev, [id]: data }));

    setInpatients((prev) => prev.map((p) => (p.nationalId === id ? { ...p, coordination: { hasCase: true } } : p)));

    setSelectedInpatient((prev) =>
      prev && prev.nationalId === id ? { ...prev, coordination: { hasCase: true } } : prev
    );

    toast.success("Coordination saved.");
    setOpenCoordinationDialog(false);
    setCoordinationTargetId(null);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="space-y-4 text-sm">
      <UnitOverviewHeader onAdmitClick={handleOpenAdmission} />

      <UnitOverviewTabs value={tab} onChange={setTab} />

      <UnitOverviewFilters showEmptyBeds={showEmptyBeds} onToggleEmptyBeds={setShowEmptyBeds} />

      {tab === "active" && (
        <ActiveContactsTable
          inpatients={inpatients}
          allBeds={allBeds}
          showEmptyBeds={showEmptyBeds}
          onRowClick={(p) => navigate(`/patients/${encodeURIComponent(p.nationalId)}`)}
          onRowContextMenu={handleRowContextMenu}
          onOpenCoordination={openCoordinationForPatient}
        />
      )}

      {tab === "transfers" && (
        <TransfersTable
          transfers={transfers}
          onReserveBedClick={handleOpenBedReservation}
          onTransferNowClick={handleOpenTransferDialog}
        />
      )}

      {/* Context menu */}
      {contextMenu && selectedInpatient && (
        <div
          className="fixed z-50 w-56 rounded border border-gray-300 bg-white text-xs shadow-md"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="block w-full px-3 py-1.5 text-left hover:bg-blue-50" onClick={handleOpenNewEws}>
            New EWS…
          </button>
          <button className="block w-full px-3 py-1.5 text-left hover:bg-blue-50" onClick={handleOpenEwsLog}>
            EWS log…
          </button>

          <div className="my-1 border-t border-gray-200" />

          <button
            className="block w-full px-3 py-1.5 text-left hover:bg-blue-50"
            onClick={() => {
              setOpenPatientCard(true);
              setContextMenu(null);
            }}
          >
            Patient card…
          </button>

          <button
            className="block w-full px-3 py-1.5 text-left hover:bg-blue-50"
            onClick={() => {
              openDischarge();
              setContextMenu(null);
            }}
          >
            Admission &amp; discharge…
          </button>

          <button className="block w-full px-3 py-1.5 text-left hover:bg-blue-50" onClick={openBedChange}>
            Place / bed…
          </button>

          <button className="block w-full px-3 py-1.5 text-left hover:bg-blue-50" onClick={openPatientLog}>
            Patient log…
          </button>

          <button className="block w-full px-3 py-1.5 text-left hover:bg-blue-50" onClick={openCoordination}>
            Coordination (Samordning)…
          </button>

          <button
            className="block w-full px-3 py-1.5 text-left hover:bg-blue-50"
            onClick={() => {
              openJournal();
              setContextMenu(null);
            }}
          >
            Journal…
          </button>

          <button className="block w-full px-3 py-1.5 text-left hover:bg-blue-50" onClick={openPlanTransfer}>
            Plan transfer…
          </button>

          <button
            className="block w-full px-3 py-1.5 text-left hover:bg-blue-50"
            onClick={() => {
              openPatientOverview();
              setContextMenu(null);
            }}
          >
            Patient overview…
          </button>

          <button
            className="block w-full border-t border-gray-200 px-3 py-1.5 text-left text-red-700 hover:bg-red-50"
            onClick={() => {
              openDischarge();
              setContextMenu(null);
            }}
          >
            End care contact…
          </button>
        </div>
      )}

      {/* Dialogs */}
      <PatientCardDialog
        open={openPatientCard && !!selectedInpatient}
        patient={selectedInpatient}
        onClose={() => setOpenPatientCard(false)}
      />

      <PlannedDischargeDialog
        open={openDischargeDialog && !!selectedInpatient}
        patient={selectedInpatient}
        initialData={
          selectedInpatient?.plannedDischarge
            ? {
                date: selectedInpatient.plannedDischarge.dateTime.split(" ")[0],
                time: selectedInpatient.plannedDischarge.dateTime.split(" ")[1] || "00:00",
                status: selectedInpatient.plannedDischarge.status as PlannedDischargeStatus,
              }
            : undefined
        }
        onClose={() => setOpenDischargeDialog(false)}
        onSave={handleSavePlannedDischarge}
      />

      <AdmitPatientDialog
        open={openAdmissionDialog}
        defaultWard="Stroke ward"
        defaultTeam="Blue team"
        beds={admissionBedOptions}
        onClose={() => setOpenAdmissionDialog(false)}
        onSave={handleSaveAdmission}
      />

      <ReserveBedDialog
        open={openBedDialog}
        beds={reserveBedOptions}
        onClose={() => {
          setOpenBedDialog(false);
          setSelectedTransferForBed(null);
        }}
        onReserve={handleReserveBed}
      />

      {/* Inbound “Transfer now” */}
      <TransferPatientDialog
        open={openTransferDialog && !!selectedTransferForAction}
        transfer={selectedTransferForAction}
        facilityOptions={[...facilityOptions]}
        unitsByFacility={unitsByFacility}
        onClose={() => setOpenTransferDialog(false)}
        onTransfer={handleTransferPatientInbound}
        confirmLabel="Transfer now"
      />

      {/* Outbound “Plan transfer” */}
      <TransferPatientDialog
        open={openPlanTransferDialog && !!outboundTransferDraft}
        transfer={outboundTransferDraft}
        facilityOptions={[...facilityOptions]}
        unitsByFacility={unitsByFacility}
        onClose={() => {
          setOpenPlanTransferDialog(false);
          setOutboundTransferDraft(null);
        }}
        onTransfer={handleSaveOutboundTransfer}
        confirmLabel="Save"
      />

      <EwsDialog
        open={openEwsDialog && !!selectedInpatient}
        patient={selectedInpatient}
        onClose={() => setOpenEwsDialog(false)}
        onSave={handleSaveNewEws}
      />

      <EwsLogDialog
        open={openEwsLogDialog && !!selectedInpatient}
        patient={selectedInpatient}
        entries={selectedInpatient ? ewsLogs[selectedInpatient.nationalId] || [] : []}
        onClose={() => setOpenEwsLogDialog(false)}
      />

      <PatientLogDialog
        open={openPatientLogDialog && !!selectedInpatient}
        patient={selectedInpatient}
        entries={selectedInpatient ? patientLogs[selectedInpatient.nationalId] || [] : []}
        onClose={() => setOpenPatientLogDialog(false)}
      />

      <ChangeBedDialog
        open={openBedChangeDialog && !!selectedInpatient}
        patient={selectedInpatient}
        beds={changeBedOptions}
        onClose={() => setOpenBedChangeDialog(false)}
        onChangeBed={handleChangeBed}
      />

      <CoordinationDialog
        open={openCoordinationDialog && !!selectedInpatient}
        patient={selectedInpatient}
        availableUnits={[...unitOptions]}
        initialData={coordinationTargetId ? coordinationCases[coordinationTargetId] : undefined}
        onClose={() => {
          setOpenCoordinationDialog(false);
          setCoordinationTargetId(null);
        }}
        onSave={handleSaveCoordination}
      />
    </div>
  );
};

export default UnitOverviewPage;
