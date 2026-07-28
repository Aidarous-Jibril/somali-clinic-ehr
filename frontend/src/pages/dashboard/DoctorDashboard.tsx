// src/pages/DoctorDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPatientName } from "../../utils/patient";
import { addDays, formatLongDate, formatTime } from "../../utils/dateFormat";
import { doctorTimeSlots } from "../../features/doctor/constants";
import type { DoctorAppointment, DoctorFilterScope, DoctorTabKey, ReferralItem } from "../../features/doctor/types";

import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { mapReferralToUi } from "../../features/patient-overview/mappers/referral.mapper";
import { useIncomingReferrals } from "../../hooks/referrals/useIncomingReferrals";
import { useOutgoingReferrals } from "../../hooks/referrals/useOutgoingReferrals";
import { useTodayAppointments } from "../../hooks/appointments/useTodayAppointments";

import { DoctorTabs } from "../../components/doctor/DoctorTabs";
import { DoctorCalendar } from "../../components/doctor/DoctorCalendar";
import { DoctorPatientList } from "../../components/doctor/DoctorPatientList";
import { DoctorReferralsCard } from "../../components/doctor/DoctorReferralsCard";
import { DoctorQuickActionsMenu } from "../../components/doctor/DoctorQuickActionsMenu";

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [filter, setFilter] = useState<DoctorFilterScope>("all");
  const [tab, setTab] = useState<DoctorTabKey>("calendar");
  const [day, setDay] = useState(new Date());

  const [menuAnchor, setMenuAnchor] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [menuAppt, setMenuAppt] = useState<DoctorAppointment | null>(null);

  const { data: appointments = [], isLoading, refetch } = useTodayAppointments(day);

  const { data: incoming = [] } = useIncomingReferrals();
  const { data: outgoing = [] } = useOutgoingReferrals();

  const mappedAppointments: DoctorAppointment[] = useMemo(
    () =>
      appointments.map((a: any) => ({
        id: a.id,
        patientId: a.patient?.id ?? "",
        patientName: getPatientName(a.patient),
        nationalId: a.patient?.nationalId ?? null,
        phone: a.patient?.phone ?? null,
        time: formatTime(a.scheduledAt),
        description: a.type || "Visit",
        status: a.status,
      })),
    [appointments]
  );

  const patientShortcuts = useMemo(
    () =>
      mappedAppointments.map(
        ({ patientId, patientName, nationalId, phone }) => ({
          patientId,
          patientName,
          nationalId,
          phone,
        })
      ),
    [mappedAppointments]
  );

  const referrals: ReferralItem[] = useMemo(() => {
    const mapItem = (r: any, direction: "in" | "out"): ReferralItem => {
      const base = mapReferralToUi(r);

      return {
        id: base.id,
        direction,
        referralDate: base.date,
        patientId: r.patientId,
        patientName: getPatientName(r.patient),
        referralType: "General",
        status: base.status,
        recipient: base.to,
        sender: base.from,
      };
    };

    return [
      ...incoming.map((r: any) => mapItem(r, "in")),
      ...outgoing.map((r: any) => mapItem(r, "out")),
    ];
  }, [incoming, outgoing]);

  const title = useMemo(() => formatLongDate(day), [day]);

  useEffect(() => {
    if (!menuAnchor) return;

    const close = () => setMenuAnchor(null);

    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuAnchor]);

  const openMenu = (
    e: React.MouseEvent,
    appt: DoctorAppointment
  ) => {
    e.preventDefault();
    setMenuAppt(appt);
    setMenuAnchor({
      mouseX: e.clientX + 2,
      mouseY: e.clientY - 6,
    });
  };

  const closeMenu = () => setMenuAnchor(null);

  const goToPatient = () => {
    if (!menuAppt) return;
    navigate(`/patients/${menuAppt.patientId}`);
  };

  const handleLifecycle = async (
    appt: DoctorAppointment,
    action: "start" | "complete"
  ) => {
    try {
      await api.post(`/appointments/${appt.id}/${action}`);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">My Overview</h1>
        <p className="text-sm text-gray-600">
          Quick view of your schedule and referrals for today.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-col gap-2 rounded border bg-gray-50 px-4 py-2 text-sm md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">Filter by:</span>

          {(["selected", "all"] as const).map((value) => (
            <label key={value} className="inline-flex items-center gap-1">
              <input
                type="radio"
                checked={filter === value}
                onChange={() => setFilter(value)}
              />
              <span>
                {value === "selected"
                  ? "Selected patient"
                  : "All patients"}
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="font-medium">Care provider:</span>
          <button className="rounded border bg-white px-3 py-1">
            👤 {user?.name || "—"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1.3fr]">
        <div className="space-y-3">
          <DoctorTabs value={tab} onChange={setTab} />

          <div className="rounded border bg-white">
            {tab === "calendar" ? (
              isLoading ? (
                <div className="p-6 text-sm text-gray-500">
                  Loading...
                </div>
              ) : (
                <DoctorCalendar
                  title={title}
                  timeSlots={doctorTimeSlots}
                  appointments={mappedAppointments}
                  onPrevDay={() => setDay((d) => addDays(d, -1))}
                  onNextDay={() => setDay((d) => addDays(d, 1))}
                  onAppointmentContextMenu={openMenu}
                  onStartAppointment={(a) =>
                    handleLifecycle(a, "start")
                  }
                  onCompleteAppointment={(a) =>
                    handleLifecycle(a, "complete")
                  }
                />
              )
            ) : (
              <DoctorPatientList patients={patientShortcuts} />
            )}
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <DoctorReferralsCard
            title="Referrals out"
            direction="out"
            referrals={referrals}
          />

          <DoctorReferralsCard
            title="Referrals in"
            direction="in"
            referrals={referrals}
          />
        </div>
      </div>

      <DoctorQuickActionsMenu
        open={Boolean(menuAnchor && menuAppt)}
        anchor={menuAnchor}
        onClose={closeMenu}
        onOpenPatientOverview={goToPatient}
        onOpenAnalysis={() => navigate("/sampling-data")}
        onOpenJournal={() => navigate("/journal")}
        onOpenSchedule={() => navigate("/appointments")}
        onOpenVisitList={() => navigate("/appointments")}
      />
    </div>
  );
};

export default DoctorDashboard;