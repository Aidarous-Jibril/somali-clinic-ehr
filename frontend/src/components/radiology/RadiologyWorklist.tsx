// //src/components/radiology/RadiologyWorklist.tsx
// import React from "react";

// type Props = {
//   rows: any[];
//   selectedId: string;
//   onSelect: (id: string) => void;
// };

// const RadiologyWorklist: React.FC<Props> = ({ rows, selectedId, onSelect, }) => {
//   return (
//     <section className="rounded border border-gray-300 bg-white">
//       {/* Header */}
//       <div className="border-b px-4 py-3">
//         <div className="text-[14px] font-semibold">
//           Worklist
//         </div>

//         <div className="text-xs text-gray-500">
//           Pending radiology examinations
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto">
//         <table className="min-w-full text-sm">
//           <thead className="border-b bg-gray-50">
//             <tr>
//               <th className="px-3 py-2 text-left font-medium">
//                 Date
//               </th>

//               <th className="px-3 py-2 text-left font-medium">
//                 MRN
//               </th>

//               <th className="px-3 py-2 text-left font-medium">
//                 Patient
//               </th>

//               <th className="px-3 py-2 text-left font-medium">
//                 Examination
//               </th>

//               <th className="px-3 py-2 text-left font-medium">
//                 Status
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-3 py-8 text-center text-gray-500"
//                 >
//                   No radiology examinations found.
//                 </td>
//               </tr>
//             )}

//             {rows.map((row) => (
//               <tr
//                 key={row.id}
//                 onClick={() => onSelect(row.id)}
//                 className={`cursor-pointer border-b hover:bg-blue-50 ${
//                   selectedId === row.id
//                     ? "bg-blue-100"
//                     : ""
//                 }`}
//               >
//                 <td className="px-3 py-2 whitespace-nowrap">
//                   {new Date(
//                     row.orderedAt
//                   ).toLocaleString()}
//                 </td>

//                 <td className="px-3 py-2">
//                   {row.personId}
//                 </td>

//                 <td className="px-3 py-2">
//                   {row.patientName}
//                 </td>

//                 <td className="px-3 py-2">
//                   {row.examination}
//                 </td>

//                 <td className="px-3 py-2">
//                   <span
//                     className={`rounded-full px-2 py-1 text-xs font-medium ${
//                       row.status === "ordered"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : row.status ===
//                           "awaiting_result"
//                         ? "bg-blue-100 text-blue-800"
//                         : row.status ===
//                           "resulted"
//                         ? "bg-green-100 text-green-800"
//                         : row.status ===
//                           "reviewed"
//                         ? "bg-purple-100 text-purple-800"
//                         : row.status ===
//                           "completed"
//                         ? "bg-gray-200 text-gray-800"
//                         : "bg-gray-100 text-gray-700"
//                     }`}
//                   >
//                     {row.status.replace(
//                       "_",
//                       " "
//                     )}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// };

// export default RadiologyWorklist;

import React from "react";
import type { GridColDef } from "@mui/x-data-grid";

import WorklistTable from "../worklist/WorklistTable";
import WorklistStatusBadge from "../worklist/WorklistStatusBadge";

import type {
  RadiologyWorklistItem,
} from "../../features/radiology/types";

type Props = {
  rows: RadiologyWorklistItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const columns: GridColDef[] = [
  {
    field: "orderedAt",
    headerName: "Date",
    flex: 1.4,
    valueFormatter: (value) =>
      value
        ? new Date(value as string).toLocaleString()
        : "",
  },

  {
    field: "personId",
    headerName: "MRN",
    flex: 1,
  },

  {
    field: "patientName",
    headerName: "Patient",
    flex: 1.5,
  },

  {
    field: "examination",
    headerName: "Examination",
    flex: 1.8,
  },

  {
    field: "status",
    headerName: "Status",
    flex: 1.2,
    sortable: false,
    renderCell: (params) => (
      <WorklistStatusBadge
        status={params.value as string}
      />
    ),
  },
];

const RadiologyWorklist: React.FC<Props> = ({
  rows,
  selectedId,
  onSelect,
}) => {
  return (
    <WorklistTable
      title="Worklist"
      subtitle="Pending radiology examinations"
      rows={rows}
      columns={columns}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
};

export default RadiologyWorklist;