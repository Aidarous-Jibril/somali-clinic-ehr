// // src/components/medications/dispensing/DosePillIcon.tsx
import { Circle, Pill, XCircle } from "lucide-react";
import type { DoseStatus } from "../../../features/medications/types";

type Props = {
  status: DoseStatus;
  selfAdmin?: boolean;
};

export function DosePillIcon({ status, selfAdmin }: Props) {
  if (status === "missed") {
    return <XCircle className="h-4 w-4 text-red-600" />;
  }

  if (status === "skipped" || status === "notNeeded") {
    return <Circle className="h-4 w-4 text-gray-300" />;
  }

  const color =
    status === "given"
      ? selfAdmin
        ? "text-emerald-700"
        : "text-green-700"
      : status === "prepared"
      ? "text-sky-700"
      : "text-amber-600";

  return <Pill className={`h-4 w-4 ${color}`} />;
}