// src/components/medications/dispensing/DosePillIcon.tsx
import { XCircle, Circle, Pill } from "lucide-react";
import type { DoseStatus } from "../../../features/medications/types";

export function DosePillIcon({
  status,
  prepared,
  selfAdmin,
}: {
  status: DoseStatus;
  prepared?: boolean;
  selfAdmin?: boolean;
}) {
  if (status === "missed") return <XCircle className="h-4 w-4 text-red-600" />;
  if (status === "notNeeded" || status === "skipped")
    return <Circle className="h-4 w-4 text-gray-300" />;

  // colors that WILL show now (because it's an SVG)
  const tint =
    status === "given"
      ? selfAdmin
        ? "text-emerald-700"
        : "text-green-700"
      : prepared
      ? "text-sky-700"
      : "text-amber-600";

  return <Pill className={`h-4 w-4 ${tint}`} />;
}
