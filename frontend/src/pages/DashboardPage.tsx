// // src/pages/DashboardPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import type {
//   DashboardAppointment,
//   DashboardFilterScope,
//   DashboardTabKey,
//   ReferralItem,
// } from "../features/dashboard/types";

// import { dashboardTimeSlots } from "../features/dashboard/mockData";

// import { DashboardTabs } from "../components/dashboard/DashboardTabs";
// import { DashboardCalendar } from "../components/dashboard/DashboardCalendar";
// import { DashboardPatientList } from "../components/dashboard/DashboardPatientList";
// import { ReferralsSummaryCard } from "../components/dashboard/ReferralsSummaryCard";
// import { PatientQuickActionsMenu } from "../components/dashboard/PatientQuickActionsMenu";

// import { api } from "../api/client";
// import { useAuth } from "../context/AuthContext";
// import { mapReferralToUi } from "../features/patient-overview/mappers/referral.mapper";
// import { useIncomingReferrals } from "../hooks/referrals/useIncomingReferrals";
// import { useOutgoingReferrals } from "../hooks/referrals/useOutgoingReferrals";
// import { useTodayAppointments } from "../hooks/appointments/useTodayAppointments";

// import { addDays, formatLongDate, formatTime } from "../utils/dateFormat";
// import { getPatientName } from "../utils/patient";

// const DashboardPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [filter, setFilter] = useState<DashboardFilterScope>("all");
//   const [tab, setTab] = useState<DashboardTabKey>("calendar");
//   const [day, setDay] = useState(new Date());

//   const [menuAnchor, setMenuAnchor] = useState<{ mouseX: number; mouseY: number; } | null>(null);

//   const [menuAppt, setMenuAppt] = useState<DashboardAppointment | null>(null);

//   const { data: appointments = [], isLoading, refetch } =
//     useTodayAppointments(day);

//   const { data: incoming = [] } = useIncomingReferrals();
//   const { data: outgoing = [] } = useOutgoingReferrals();

//   const mappedAppointments: DashboardAppointment[] = useMemo(
//     () =>
//       appointments.map((a: any) => ({
//         id: a.id,
//         patientId: a.patient?.id ?? "",
//         patientName: getPatientName(a.patient),
//         nationalId: a.patient?.nationalId ?? null,
//         phone: a.patient?.phone ?? null,
//         time: formatTime(a.scheduledAt),
//         description: a.type || "Visit",
//         status: a.status,
//       })),
//     [appointments]
//   );

//   const patientShortcuts = useMemo(
//     () =>
//       mappedAppointments.map(
//         ({ patientId, patientName, nationalId, phone }) => ({
//           patientId,
//           patientName,
//           nationalId,
//           phone,
//         })
//       ),
//     [mappedAppointments]
//   );

//   const referrals: ReferralItem[] = useMemo(() => {
//     const mapItem = (r: any, direction: "in" | "out"): ReferralItem => {
//       const base = mapReferralToUi(r);

//       return {
//         id: base.id,
//         direction,
//         referralDate: base.date,
//         patientId: r.patientId,
//         patientName: getPatientName(r.patient),
//         referralType: "General",
//         status: base.status,
//         recipient: base.to,
//         sender: base.from,
//       };
//     };

//     return [
//       ...incoming.map((r: any) => mapItem(r, "in")),
//       ...outgoing.map((r: any) => mapItem(r, "out")),
//     ];
//   }, [incoming, outgoing]);

//   const title = useMemo(() => formatLongDate(day), [day]);

//   useEffect(() => {
//     if (!menuAnchor) return;

//     const close = () => setMenuAnchor(null);

//     window.addEventListener("click", close);
//     return () => window.removeEventListener("click", close);
//   }, [menuAnchor]);

//   const openMenu = (
//     e: React.MouseEvent,
//     appt: DashboardAppointment
//   ) => {
//     e.preventDefault();
//     setMenuAppt(appt);
//     setMenuAnchor({
//       mouseX: e.clientX + 2,
//       mouseY: e.clientY - 6,
//     });
//   };

//   const closeMenu = () => setMenuAnchor(null);

//   const goToPatient = () => {
//     if (!menuAppt) return;
//     navigate(`/patients/${menuAppt.patientId}`);
//   };

//   const handleLifecycle = async (
//     appt: DashboardAppointment,
//     action: "start" | "complete"
//   ) => {
//     try {
//       await api.post(`/appointments/${appt.id}/${action}`);
//       await refetch();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl font-semibold">My Overview</h1>
//         <p className="text-sm text-gray-600">
//           Quick view of your schedule and referrals for today.
//         </p>
//       </div>

//       {/* Filter */}
//       <div className="flex flex-col gap-2 rounded border bg-gray-50 px-4 py-2 text-sm md:flex-row md:justify-between">
//         <div className="flex items-center gap-3">
//           <span className="font-medium">Filter by:</span>

//           {(["selected", "all"] as const).map((value) => (
//             <label key={value} className="inline-flex items-center gap-1">
//               <input
//                 type="radio"
//                 checked={filter === value}
//                 onChange={() => setFilter(value)}
//               />
//               <span>
//                 {value === "selected"
//                   ? "Selected patient"
//                   : "All patients"}
//               </span>
//             </label>
//           ))}
//         </div>

//         <div className="flex items-center gap-2 text-xs md:text-sm">
//           <span className="font-medium">Care provider:</span>
//           <button className="rounded border bg-white px-3 py-1">
//             👤 {user?.name || "—"}
//           </button>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="grid gap-4 lg:grid-cols-[2fr_1.3fr]">
//         <div className="space-y-3">
//           <DashboardTabs value={tab} onChange={setTab} />

//           <div className="rounded border bg-white">
//             {tab === "calendar" ? (
//               isLoading ? (
//                 <div className="p-6 text-sm text-gray-500">Loading...</div>
//               ) : (
//                 <DashboardCalendar
//                   title={title}
//                   timeSlots={dashboardTimeSlots}
//                   appointments={mappedAppointments}
//                   onPrevDay={() => setDay((d) => addDays(d, -1))}
//                   onNextDay={() => setDay((d) => addDays(d, 1))}
//                   onAppointmentContextMenu={openMenu}
//                   onStartAppointment={(a) =>
//                     handleLifecycle(a, "start")
//                   }
//                   onCompleteAppointment={(a) =>
//                     handleLifecycle(a, "complete")
//                   }
//                 />
//               )
//             ) : (
//               <DashboardPatientList patients={patientShortcuts} />
//             )}
//           </div>
//         </div>

//         <div className="space-y-3 text-xs">
//           <ReferralsSummaryCard
//             title="Referrals out"
//             direction="out"
//             referrals={referrals}
//           />

//           <ReferralsSummaryCard
//             title="Referrals in"
//             direction="in"
//             referrals={referrals}
//           />
//         </div>
//       </div>

//       <PatientQuickActionsMenu
//         open={Boolean(menuAnchor && menuAppt)}
//         anchor={menuAnchor}
//         onClose={closeMenu}
//         onOpenPatientOverview={goToPatient}
//         onOpenAnalysis={() => navigate("/sampling-data")}
//         onOpenJournal={() => navigate("/journal")}
//         onOpenSchedule={() => navigate("/appointments")}
//         onOpenVisitList={() => navigate("/appointments")}
//       />
//     </div>
//   );
// };

// export default DashboardPage;

// src/pages/DashboardPage.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import LabDashboard from "./LabDashboard";
import DoctorDashboard from "./DoctorDashboard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  // ROLE SWITCH
  if (user.role === "Lab" || user.role === "Radiology") {
    return <LabDashboard />;
  }

  return <DoctorDashboard />;
};

export default DashboardPage;