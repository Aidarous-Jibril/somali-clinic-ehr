// src/pages/DashboardPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  DashboardFilterScope,
  DashboardTabKey,
  DashboardAppointment,
} from "../features/dashboard/types";

import {
  dashboardTimeSlots,
  defaultCareProvider,
  sampleAppointments,
  sampleReferrals,
  unsignedCard,
  unverifiedCard,
  questionsCard,
} from "../features/dashboard/mockData";

import { DashboardTabs } from "../components/dashboard/DashboardTabs";
import { DashboardCalendar } from "../components/dashboard/DashboardCalendar";
import { DashboardPatientList } from "../components/dashboard/DashboardPatientList";
import { DashboardLinks } from "../components/dashboard/DashboardLinks";
import { ReferralsSummaryCard } from "../components/dashboard/ReferralsSummaryCard";
import { SummaryCard } from "../components/dashboard/SummaryCard";
import { PatientQuickActionsMenu } from "../components/dashboard/PatientQuickActionsMenu";

const formatLongDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const addDays = (d: Date, days: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // ------------------------------------------------------
  // State: filter + tabs
  // ------------------------------------------------------
  const [filter, setFilter] = useState<DashboardFilterScope>("all");
  const [tab, setTab] = useState<DashboardTabKey>("calendar");

  // ------------------------------------------------------
  // State: calendar date (Cosmic arrows)
  // ------------------------------------------------------
  const [day, setDay] = useState<Date>(() => new Date());

  // ------------------------------------------------------
  // State: quick actions menu (Cosmic right-click menu)
  // ------------------------------------------------------
  const [menuAnchor, setMenuAnchor] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [menuAppt, setMenuAppt] = useState<DashboardAppointment | null>(null);

  // Close menu on any click
  useEffect(() => {
    if (!menuAnchor) return;
    const close = () => setMenuAnchor(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuAnchor]);

  // ------------------------------------------------------
  // Derived: title + patient shortcuts
  // ------------------------------------------------------
  const todayTitle = useMemo(() => formatLongDate(day), [day]);

  const patientShortcuts = useMemo(
    () =>
      sampleAppointments.map((a) => ({
        patientId: a.patientId,
        patientName: a.patientName,
      })),
    []
  );

  // ------------------------------------------------------
  // Handlers: appointment menu
  // ------------------------------------------------------
  const openAppointmentMenu = (e: React.MouseEvent, appt: DashboardAppointment) => {
    e.preventDefault();
    setMenuAppt(appt);
    setMenuAnchor({ mouseX: e.clientX + 2, mouseY: e.clientY - 6 });
  };

  const openAppointmentMenuFromDoubleClick = (appt: DashboardAppointment) => {
    // emulate Cosmic “double click -> actions” (open menu at a reasonable spot)
    setMenuAppt(appt);
    setMenuAnchor({ mouseX: 260, mouseY: 240 });
  };

  const closeMenu = () => setMenuAnchor(null);

  const openPatientOverview = () => {
    if (!menuAppt) return;
    navigate(`/patients/${encodeURIComponent(menuAppt.patientId)}`);
  };

  const openAnalysis = () => navigate("/sampling-data");
  const openJournal = () => navigate("/journal");
  const openSchedule = () => navigate("/appointments");
  const openVisitList = () => navigate("/appointments"); // placeholder route for now

  // ------------------------------------------------------
  // Referrals click (next step: open referrals list dialog)
  // ------------------------------------------------------
  const openReferralsOut = () => {
    // next: open a dialog like Cosmic "Utgående remisser"
    // For now, just navigate or keep placeholder
    // navigate("/referrals/out"); // if you add route later
    console.log("Open referrals out list");
  };

  const openReferralsIn = () => {
    // next: open a dialog like Cosmic "Inkommande remisser"
    console.log("Open referrals in list");
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold">My Overview</h1>
        <p className="text-sm text-gray-600">
          Quick view of your schedule, tasks, referrals and unsigned items for today.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-2 rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">Filter by:</span>

          <label className="inline-flex cursor-pointer items-center gap-1">
            <input type="radio" className="h-4 w-4" checked={filter === "selected"} onChange={() => setFilter("selected")} />
            <span>Selected patient</span>
          </label>

          <label className="inline-flex cursor-pointer items-center gap-1">
            <input type="radio" className="h-4 w-4" checked={filter === "all"} onChange={() => setFilter("all")} />
            <span>All patients</span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="font-medium">Care provider:</span>
          <button type="button" className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-200 text-xs">👤</span>
            <span>
              {defaultCareProvider.name}
              {defaultCareProvider.title ? `, ${defaultCareProvider.title}` : ""}
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        {/* LEFT COLUMN */}
        <div className="space-y-3">
          <DashboardTabs value={tab} onChange={setTab} />

          <div className="rounded border border-gray-300 bg-white">
            {tab === "calendar" && (
              <DashboardCalendar
                title={todayTitle}
                timeSlots={dashboardTimeSlots}
                appointments={sampleAppointments}
                onPrevDay={() => setDay((d) => addDays(d, -1))}
                onNextDay={() => setDay((d) => addDays(d, +1))}
                onAppointmentContextMenu={openAppointmentMenu}
                onAppointmentDoubleClick={openAppointmentMenuFromDoubleClick}
              />
            )}

            {tab === "patients" && <DashboardPatientList patients={patientShortcuts} />}

            {tab === "links" && (
              <DashboardLinks links={["Lab results portal", "Radiology system", "Local clinical guidelines"]} />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN – Cosmic-like summary cards */}
        <div className="space-y-3 text-xs">
          <ReferralsSummaryCard title="Referrals out" direction="out" referrals={sampleReferrals} onOpen={openReferralsOut} />
          <ReferralsSummaryCard title="Referrals in" direction="in" referrals={sampleReferrals} onOpen={openReferralsIn} />

          <SummaryCard model={unsignedCard} />
          <SummaryCard model={unverifiedCard} />
          <SummaryCard model={questionsCard} />
        </div>
      </div>

      {/* Cosmic-like quick actions menu */}
      <PatientQuickActionsMenu
        open={Boolean(menuAnchor && menuAppt)}
        anchor={menuAnchor}
        onClose={closeMenu}
        onOpenPatientOverview={openPatientOverview}
        onOpenAnalysis={openAnalysis}
        onOpenJournal={openJournal}
        onOpenSchedule={openSchedule}
        onOpenVisitList={openVisitList}
      />
    </div>
  );
};

export default DashboardPage;
