import { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export function TreatmentInfoPanel() {
  const [careContact, setCareContact] = useState("2024-09-02 • Medicinavdelning 1");
  const [prescriber, setPrescriber] = useState("Joanna Weather, Leg läkare");
  const [where, setWhere] = useState("Administreras på enhet");

  return (
    <div className="rounded border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
        Behandlingsinformation
      </div>

      <div className="p-3 space-y-3">
        <FormControl size="small" fullWidth>
          <InputLabel id="care-contact">Vårdkontakt</InputLabel>
          <Select
            labelId="care-contact"
            label="Vårdkontakt"
            value={careContact}
            onChange={(e) => setCareContact(String(e.target.value))}
          >
            <MenuItem value="2024-09-02 • Medicinavdelning 1">2024-09-02 • Medicinavdelning 1</MenuItem>
            <MenuItem value="2024-09-03 • Akutmottagning">2024-09-03 • Akutmottagning</MenuItem>
          </Select>
        </FormControl>

        <div className="text-xs text-gray-600">
          Ordinatör: <span className="font-medium text-gray-800">{prescriber}</span>
        </div>

        <FormControl size="small" fullWidth>
          <InputLabel id="where">Förskrivning / Administrering</InputLabel>
          <Select
            labelId="where"
            label="Förskrivning / Administrering"
            value={where}
            onChange={(e) => setWhere(String(e.target.value))}
          >
            <MenuItem value="Förskrivning">Förskrivning</MenuItem>
            <MenuItem value="Administreras på enhet">Administreras på enhet</MenuItem>
          </Select>
        </FormControl>

        <div className="rounded border border-gray-200 bg-white">
          <div className="border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">Varningar</div>
          <div className="p-3 text-xs text-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              Interaktion (mock)
            </div>
            <Button size="small" variant="outlined">Visa</Button>
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-white">
          <div className="border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">Om biverkningar</div>
          <div className="p-3 text-xs text-gray-600">—</div>
        </div>
      </div>
    </div>
  );
}
