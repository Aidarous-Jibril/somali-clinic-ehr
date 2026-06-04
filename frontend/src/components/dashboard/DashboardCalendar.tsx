// src/components/dashboard/DashboardCalendar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import type { DashboardAppointment } from "../../features/dashboard/types";

type Props = {
  title: string;
  timeSlots: readonly string[];
  appointments: DashboardAppointment[];
  onPrevDay: () => void;
  onNextDay: () => void;
  onAppointmentContextMenu: (
    e: React.MouseEvent,
    appt: DashboardAppointment
  ) => void;
  onStartAppointment: (appt: DashboardAppointment) => void;
  onCompleteAppointment: (appt: DashboardAppointment) => void;
};

export const DashboardCalendar: React.FC<Props> = ({
  title,
  timeSlots,
  appointments,
  onPrevDay,
  onNextDay,
  onAppointmentContextMenu,
  onStartAppointment,
  onCompleteAppointment,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between border-b px-3 py-2 text-sm">
        <button onClick={onPrevDay}>◀</button>
        <div className="font-medium">{title}</div>
        <button onClick={onNextDay}>▶</button>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-xs">
          <tbody>
            {timeSlots.map((time) => {
              const items = appointments.filter((a) =>
                a.time.startsWith(time.slice(0, 2))
              );

              return (
                <tr key={time} className="border-b">
                  <td className="w-16 px-3 py-2 text-gray-500">
                    {time}
                  </td>

                  <td className="px-2 py-2">
                    {items.length === 0 ? (
                      <span className="text-gray-300">—</span>
                    ) : (
                      <div className="space-y-1">
                        {items.map((appt) => (
                          <div
                            key={appt.id}
                            className="rounded border bg-blue-50 px-2 py-1"
                            onContextMenu={(e) =>
                              onAppointmentContextMenu(e, appt)
                            }
                          >
                            <div
                              className="cursor-pointer text-[11px] font-medium hover:underline"
                              onClick={() =>
                                navigate(`/patients/${appt.patientId}`)
                              }
                            >
                              {appt.patientName}
                            </div>

                            <div className="text-[11px] text-gray-700">
                              {appt.time} • {appt.description}
                            </div>

                            <div className="text-[10px] text-orange-700">
                              {appt.status}
                            </div>

                            {appt.status === "arrived" && (
                              <button
                                className="text-[10px] text-blue-600"
                                onClick={() =>
                                  onStartAppointment(appt)
                                }
                              >
                                ▶ Start
                              </button>
                            )}

                            {appt.status === "in_progress" && (
                              <button
                                className="text-[10px] text-green-600"
                                onClick={() =>
                                  onCompleteAppointment(appt)
                                }
                              >
                                ✔ Complete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
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