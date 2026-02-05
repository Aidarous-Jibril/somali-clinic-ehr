import { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
} from "@mui/material";


import { formatDateTime } from "./vaccination.utils";
import type { Vaccination, VaccinationEventRow } from "../../../features/medications/types";

export function VaccinationCardDialog({
  open,
  onClose,
  vaccinations,
}: {
  open: boolean;
  onClose: () => void;
  vaccinations: Vaccination[];
}) {
  /* Group vaccinations by reason (Cosmic-style tabs) */
  const reasons = useMemo(
    () => Array.from(new Set(vaccinations.map((v) => v.reason))),
    [vaccinations]
  );

  const [tab, setTab] = useState(0);
  const activeReason = reasons[tab] ?? "";

  const rows = useMemo<VaccinationEventRow[]>(() => {
    return vaccinations
      .filter((v) => v.reason === activeReason)
      .flatMap((v) =>
        v.events.map((e) => ({ vaccination: v, event: e }))
      );
  }, [vaccinations, activeReason]);

  const given = rows.filter((r) => r.event.status === "given");
  const planned = rows.filter((r) => r.event.status === "planned");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Vaccination card</DialogTitle>

      <DialogContent dividers>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {reasons.map((r) => (
            <Tab key={r} label={r} />
          ))}
        </Tabs>

        <div className="mt-3 grid grid-cols-2 gap-4 text-[11px]">
          {[
            { title: "Administered", rows: given },
            { title: "Planned", rows: planned },
          ].map((block) => (
            <div key={block.title} className="rounded border border-gray-200">
              <div className="border-b bg-gray-50 px-2 py-1 font-semibold">
                {block.title}
              </div>

              <div className="p-2 space-y-2">
                {block.rows.length === 0 ? (
                  <div className="text-gray-500">—</div>
                ) : (
                  block.rows.map(({ vaccination, event }, i) => (
                    <div
                      key={`${vaccination.id}:${event.at}:${i}`}
                      className="rounded border bg-white px-2 py-1"
                    >
                      <div className="font-semibold">
                        {vaccination.name}
                      </div>
                      <div className="text-gray-600">
                        Dose: {event.doseLabel} •{" "}
                        {formatDateTime(event.at)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined">Print…</Button>
        <Button variant="contained" onClick={onClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
