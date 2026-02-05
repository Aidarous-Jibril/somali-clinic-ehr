import type { FavoriteTemplate } from "../../../features/medications/types";

function MiniTimeline() {
  const ticks = ["12:00", "16:00", "20:00", "00:00", "04:00", "08:00"];
  return (
    <div className="h-16 rounded border border-gray-200 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[90px_100%]" />
      <div className="absolute inset-x-0 top-1 flex justify-between px-3 text-[10px] text-gray-500">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      {/* mock doses */}
      <div className="absolute left-[90px] top-[34px] h-2 w-2 rounded-full bg-blue-600" title="Dose" />
      <div className="absolute left-[270px] top-[34px] h-2 w-2 rounded-full bg-blue-600" title="Dose" />
      <div className="absolute right-[60px] top-[34px] h-2 w-2 rounded-full bg-blue-600" title="Dose" />
    </div>
  );
}

export function OrderPreview({ selected }: { selected: FavoriteTemplate | null }) {
  return (
    <div className="grid gap-3 md:grid-cols-[320px_1fr]">
      <div className="rounded border border-gray-200 bg-white p-3">
        <div className="text-xs text-gray-500">Vald mall</div>
        <div className="mt-1 font-semibold text-gray-900">
          {selected ? `${selected.product} ${selected.strength}` : "—"}
        </div>
        <div className="text-xs text-gray-600">{selected ? selected.form : ""}</div>
        <div className="mt-2 text-xs text-gray-700">
          <span className="text-gray-500">Dosing: </span>
          {selected ? selected.dosing : "—"}
        </div>
        <div className="mt-1 text-xs text-gray-700">
          <span className="text-gray-500">Treatment reason: </span>
          {selected ? selected.treatmentReason : "—"}
        </div>
      </div>

      <div>
        <MiniTimeline />
      </div>
    </div>
  );
}
