// src/components/dashboard/DashboardCalendar.tsx
import React from "react";
import type { DashboardAppointment } from "../../features/dashboard/types";

type Props = {
  title: string; // "Tuesday, January 20, 2026"
  timeSlots: readonly string[];
  appointments: DashboardAppointment[];

  onPrevDay: () => void;
  onNextDay: () => void;

  onAppointmentContextMenu: (e: React.MouseEvent, appt: DashboardAppointment) => void;
  onAppointmentDoubleClick: (appt: DashboardAppointment) => void;
};

export const DashboardCalendar: React.FC<Props> = ({
  title,
  timeSlots,
  appointments,
  onPrevDay,
  onNextDay,
  onAppointmentContextMenu,
  onAppointmentDoubleClick,
}) => {
  return (
    <div className="flex flex-col">
      {/* Date header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 text-sm">
        <button type="button" className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-xs hover:bg-gray-100" onClick={onPrevDay}>
          ◀
        </button>

        <div className="font-medium">{title}</div>

        <button type="button" className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-xs hover:bg-gray-100" onClick={onNextDay}>
          ▶
        </button>
      </div>

      {/* Time grid */}
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-xs">
          <tbody>
            {timeSlots.map((time) => {
              const appt = appointments.find((a) => a.time === time);

              return (
                <tr key={time} className="border-b border-gray-100">
                  <td className="w-16 px-3 py-2 align-top text-gray-500">{time}</td>
                  <td className="px-2 py-2 align-top">
                    {appt ? (
                      <div
                        className="flex items-start gap-2 rounded border border-blue-200 bg-blue-50 px-2 py-1 cursor-pointer"
                        onContextMenu={(e) => onAppointmentContextMenu(e, appt)}
                        onDoubleClick={() => onAppointmentDoubleClick(appt)}
                        title="Right-click or double click for actions"
                      >
                        <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                          P
                        </div>
                        <div>
                          <div className="text-[11px] font-medium">
                            {appt.patientId} {appt.patientName}
                          </div>
                          <div className="text-[11px] text-gray-700">{appt.description}</div>
                          {appt.status && <div className="text-[10px] text-orange-700">{appt.status}</div>}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
