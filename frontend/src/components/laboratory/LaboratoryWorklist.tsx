// //src/components/laboratory/LaboratoryWorklist.tsx
// import React from "react";

// import {
//   Card,
//   CardHeader,
//   CardContent,
// } from "@mui/material";

// import { DataGrid,} from "@mui/x-data-grid";
// import type { GridColDef } from "@mui/x-data-grid";
// import type { LaboratoryWorklistItem } from "../../features/laboratory/types";
// // import type { SamplingWorklistItem } from "../../features/sampling/types";

// type Props = {
//   rows: LaboratoryWorklistItem[];
//   selectedId: string;
//   onSelect: (id: string) => void;
// };

// const columns: GridColDef[] = [
//   {
//     field: "orderedAt",
//     headerName: "Date",
//     flex: 1.2,
//     valueFormatter: (value) => value ? new Date(value as string).toLocaleString(): "",
//   },

//   {
//     field: "personId",
//     headerName: "Person ID",
//     flex: 1,
//   },

//   {
//     field: "patientName",
//     headerName: "Patient",
//     flex: 1.4,
//   },

//   {
//     field: "specialty",
//     headerName: "Specialty",
//     flex: 1,
//   },

//   {
//     field: "rid",
//     headerName: "RID",
//     flex: 1,
//   },
// ];

// const LaboratoryWorklist: React.FC<Props> = ({
//   rows,
//   selectedId,
//   onSelect,
// }) => {
//   return (
//     <Card elevation={1}>
//       <CardHeader
//         title="Worklist"
//         subheader="Pending sampling orders"
//       />

//       <CardContent sx={{ p: 0 }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         autoHeight
//         hideFooter
//         density="compact"
//         disableRowSelectionOnClick
//         onRowClick={(params) =>
//           onSelect(params.row.id)
//         }
//         getRowClassName={(params) =>
//           params.id === selectedId
//             ? "selected-row"
//             : ""
//         }
//         sx={{
//           border: 0,

//           "& .MuiDataGrid-row": {
//             cursor: "pointer",
//           },

//           "& .selected-row": {
//             backgroundColor: "#e3f2fd",
//           },
//         }}
//       />
//       </CardContent>
//     </Card>
//   );
// };

// export default LaboratoryWorklist;


//src/components/laboratory/LaboratoryWorklist.tsx

import React from "react";
import type { GridColDef } from "@mui/x-data-grid";

import WorklistTable from "../worklist/WorklistTable";

import type {
  LaboratoryWorklistItem,
} from "../../features/laboratory/types";

type Props = {
  rows: LaboratoryWorklistItem[];
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
    headerName: "Person ID",
    flex: 1,
  },
  {
    field: "patientName",
    headerName: "Patient",
    flex: 1.4,
  },
  {
    field: "orderingUnit",
    headerName: "Unit",
    flex: 1.3,
  },
  {
    field: "analysis",
    headerName: "Analysis",
    flex: 1.8,
  },
];

const LaboratoryWorklist: React.FC<Props> = ({
  rows,
  selectedId,
  onSelect,
}) => {
  return (
    <WorklistTable
      title="Worklist"
      subtitle="Pending laboratory examinations"
      rows={rows}
      columns={columns}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
};

export default LaboratoryWorklist;