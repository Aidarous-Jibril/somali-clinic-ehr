//src/components/patient-overview/RadiologyResultsWidget.tsx
import React, { useMemo, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import type { RadiologyResult } from "../../features/patient-overview/types";
import RadiologyReportDialog from "../../features/patient-overview/dialogs/RadiologyReportDialog";

type Props = {
  results: RadiologyResult[];
  search: string;
  onSearchChange: (value: string) => void;
};

const RadiologyResultsWidget: React.FC<Props> = ({ results, search, onSearchChange, }) => {
  const [selectedResult, setSelectedResult] = useState<RadiologyResult | null>(null);

  const [openDialog, setOpenDialog] = useState(false);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return results;

    return results.filter((r) =>
      [
        r.examination,
        r.impression,
        r.modality,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [results, search]);

  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <span className="text-[13px] font-semibold">
          Radiology results
        </span>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-7 w-32 rounded border border-gray-300 px-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-40"
          />

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <MoreVertIcon fontSize="small" />
          </button>
        </div>
      </header>

      <div className="max-h-64 overflow-auto p-2">
        {filteredResults.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No radiology reports found.
          </div>
        ) : (
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="text-gray-500">
                <th className="sticky top-0 bg-white px-2 py-1 text-left font-normal">
                  Examination
                </th>

                <th className="sticky top-0 bg-white px-2 py-1 text-left font-normal">
                  Impression
                </th>

                <th className="sticky top-0 bg-white px-2 py-1 text-left font-normal">
                  Report date
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.map((result) => (
                <tr
                  key={result.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedResult(result);
                    setOpenDialog(true);
                  }}
                >
                  <td className="border-b px-2 py-1">
                    <div className="font-medium">
                      {result.examination}
                    </div>

                    <div className="text-[10px] text-gray-500">
                      {result.modality}
                    </div>
                  </td>

                  <td className="border-b px-2 py-1">
                    {result.impression}
                  </td>

                  <td className="border-b px-2 py-1 text-gray-600">
                    {new Date(result.reportedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <RadiologyReportDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        result={selectedResult}
      />
    </section>
  );
};

export default RadiologyResultsWidget;